// ════════════════════════════════════════════════════════════════
// Cadeia de Valor TO-BE — ANBIMA (L1 · L2 · L3 · L4)
// Gerado automaticamente a partir de "value chain ANBIMA.md".
// Para regerar, rode o script de geração novamente em vez de editar à mão.
// ════════════════════════════════════════════════════════════════
import type { L1Process } from "@/stores/valueChainStore";
import type { ArchNodeL1 } from "@/types/architectureContextTypes";

/** Nós ricos (ficha de escopo e contexto) — consumidos pelo módulo de Arquitetura. */
export const anbimaArchitectureL1: ArchNodeL1[] = [
  {
    "id": "anb-l1-s2e",
    "name": "Estratégia a Execução",
    "code": "S2E",
    "domain": "Processo de Gestão",
    "category": "SUPPORT",
    "description": "Definir o direcionamento estratégico da ANBIMA, governar seus órgãos estatutários e desdobrar a estratégia em portfólio de iniciativas, metas, capacidades e conhecimento organizacional, garantindo que a associação atue de forma coerente com os interesses de associados, reguladores e mercado.",
    "objective": "Definir o direcionamento estratégico da ANBIMA, governar seus órgãos estatutários e desdobrar a estratégia em portfólio de iniciativas, metas, capacidades e conhecimento organizacional, garantindo que a associação atue de forma coerente com os interesses de associados, reguladores e mercado.",
    "valueProposition": "Dar clareza de rumo e prioridade à associação, conectando decisões de governança à execução e permitindo que recursos sejam alocados nas iniciativas de maior valor para associados e para o desenvolvimento do mercado de capitais.",
    "scopeBoundary": "Abrange da leitura de ambiente e formulação estratégica até o acompanhamento de desempenho institucional, incluindo a governança associativa (Assembleia, Conselho, Diretoria, comitês), a gestão do portfólio de projetos estratégicos, a arquitetura de processos e a gestão do conhecimento e do acervo documental. Não inclui a execução das iniciativas pelas áreas finalísticas nem a gestão orçamentária (R2R).",
    "inputs": "Visão e expectativas de associados e Conselho; agenda regulatória e tendências de mercado (I2A, I2I); resultados financeiros e orçamentários (R2R); riscos corporativos (GRC); indicadores operacionais das cadeias finalísticas; estatuto social e regimentos.",
    "outputs": "Plano estratégico plurianual e desdobramento anual; atas, deliberações e atos societários; portfólio de projetos priorizado e status; painel de desempenho institucional; cadeia de valor e processos documentados; acervo documental organizado.",
    "stakeholders": "Presidência, Diretoria e Conselho; superintendências; Jurídico (secretaria de governança); PMO/Estratégia; Representação de Mercados (acervo). Destinos: órgãos de governança, todas as áreas da associação, associados e, quando aplicável, reguladores.",
    "responsible": "Jurídico, Representação de Mercados",
    "businessUnit": "Processos de Gestão",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 33,
    "policies": [
      {
        "id": "anb-l1-s2e-pol-1",
        "name": "Estatuto Social da ANBIMA",
        "type": "Estatuto / Regimento",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-s2e-pol-2",
        "name": "regimentos internos do Conselho, Diretoria e comitês",
        "type": "Estatuto / Regimento",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-s2e-pol-3",
        "name": "Código Civil (associações)",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-s2e-pol-4",
        "name": "política de gestão documental",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "% de metas estratégicas atingidas",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de projetos estratégicos no prazo/orçamento",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Benefícios capturados vs. planejados",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de processos críticos documentados",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Prazo de publicação de atas",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Novo Sistema Organismos",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Ferramenta de gestão de portfólio/OKR (ex.: Jira Align ou ClickUp, já presente na casa)",
      "TO-BE: Power BI para painel institucional",
      "TO-BE: SharePoint como repositório oficial de atos e acervo",
      "TO-BE: repositório de processos (BPM/ARIS ou Fluig BPM) para a arquitetura de processos"
    ],
    "painPoints": [
      "Baixa cobertura AS-IS: apenas 2 macroprocessos mapeados neste L1 — formulação estratégica, portfólio, desempenho e arquitetura de processos são lacunas",
      "Risco de desconexão entre estratégia e execução, ausência de indicadores institucionais e conhecimento disperso entre áreas e sistemas"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-s2e-1",
        "name": "Definir Direcionamento Estratégico",
        "code": "S2E.1",
        "description": "Formular a estratégia institucional e assegurar o funcionamento da governança associativa.",
        "objective": "Formular a estratégia institucional e assegurar o funcionamento da governança associativa.",
        "valueProposition": "Rumo claro e decisões legitimadas pelos órgãos estatutários.",
        "scopeBoundary": "Compreende os L3: S2E.1.1 Formular Estratégia Institucional; S2E.1.2 Gerir Governança Associativa. Insere-se no L1 S2E e se limita às atividades descritas nesses L3.",
        "inputs": "documentos. Fornecedores: Área interna.",
        "outputs": "verirficar se o doc está ok e arquivar.",
        "stakeholders": "Áreas executoras: Jurídico. Destinos: Áreas internas.",
        "responsible": "Jurídico",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 50,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% metas estratégicas atingidas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Atas publicadas no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Microsoft Excel",
          "Microsoft SharePoint",
          "Microsoft Word"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-091)",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2e-1-1",
            "name": "Formular Estratégia Institucional",
            "code": "S2E.1.1",
            "description": "Define propósito, posicionamento e plano estratégico plurianual da ANBIMA frente a associados, reguladores e mercado.",
            "objective": "Define propósito, posicionamento e plano estratégico plurianual da ANBIMA frente a associados, reguladores e mercado.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 S2E.1 Definir Direcionamento Estratégico.",
            "scopeBoundary": "Atividades L4 propostas: Analisar ambiente regulatório, de mercado e tendências ; Elaborar planejamento estratégico plurianual ; Desdobrar estratégia em objetivos, metas e OKRs.",
            "inputs": "Diretrizes estratégicas e normativas do L1 S2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 S2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-s2e-1-1-pol-1",
                "name": "Estatuto",
                "type": "Estatuto / Regimento",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-s2e-1-1-pol-2",
                "name": "diretrizes do Conselho",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "Power BI (sugerido)",
              "SharePoint (sugerido)",
              "Microsoft Copilot (pesquisa e síntese) (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-1-1-1",
                "name": "Analisar ambiente regulatório, de mercado e tendências",
                "code": "S2E.1.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.1.1 Formular Estratégia Institucional.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-1-1-2",
                "name": "Elaborar planejamento estratégico plurianual",
                "code": "S2E.1.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.1.1 Formular Estratégia Institucional.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-1-1-3",
                "name": "Desdobrar estratégia em objetivos, metas e OKRs",
                "code": "S2E.1.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.1.1 Formular Estratégia Institucional.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-s2e-1-2",
            "name": "Gerir Governança Associativa",
            "code": "S2E.1.2",
            "description": "Suporta Assembleia, Conselho, Diretoria e comitês estatutários, e mantém atos e documentos de representação.",
            "objective": "Suporta Assembleia, Conselho, Diretoria e comitês estatutários, e mantém atos e documentos de representação.",
            "valueProposition": "controle.",
            "scopeBoundary": "Atividades L4: Secretariar Assembleia, Conselho e Diretoria ; Gerir mandatos e composição dos órgãos estatutários ; Gerir acervo de procurações, atas e documentos de representação. Macroprocessos AS-IS: OP-091.",
            "inputs": "documentos. Fornecedores: Área interna.",
            "outputs": "verirficar se o doc está ok e arquivar.",
            "stakeholders": "Áreas executoras: Jurídico. Destinos: Áreas internas.",
            "responsible": "Jurídico",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft SharePoint",
              "Microsoft Word"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-091)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-091"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-1-2-1",
                "name": "Secretariar Assembleia, Conselho e Diretoria",
                "code": "S2E.1.2.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.1.2 Gerir Governança Associativa.",
                "responsible": "Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-1-2-2",
                "name": "Gerir mandatos e composição dos órgãos estatutários",
                "code": "S2E.1.2.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.1.2 Gerir Governança Associativa.",
                "responsible": "Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-1-2-3",
                "name": "Gerir acervo de procurações, atas e documentos de representação",
                "code": "S2E.1.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-091).",
                "scopeBoundary": "Atividade do L3 S2E.1.2 Gerir Governança Associativa.",
                "responsible": "Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-s2e-2",
        "name": "Gerir Portfólio e Desempenho",
        "code": "S2E.2",
        "description": "Priorizar e acompanhar o portfólio de iniciativas estratégicas e medir o desempenho institucional.",
        "objective": "Priorizar e acompanhar o portfólio de iniciativas estratégicas e medir o desempenho institucional.",
        "valueProposition": "Recursos concentrados no que gera mais valor, com transparência de resultados.",
        "scopeBoundary": "Compreende os L3: S2E.2.1 Gerir Portfólio de Projetos Estratégicos; S2E.2.2 Monitorar Desempenho Institucional. Insere-se no L1 S2E e se limita às atividades descritas nesses L3.",
        "inputs": "Diretrizes do L1 S2E; ver detalhamento nos L3.",
        "outputs": "Prioriza, acompanha e captura benefícios das iniciativas estratégicas; Mede e reporta resultados institucionais à governança.",
        "stakeholders": "Área responsável a definir (sem macroprocesso AS-IS).",
        "responsible": "A definir",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "pending",
        "contextValidationPercent": 0,
        "policies": [
          {
            "id": "anb-l2-s2e-2-pol-1",
            "name": "Metodologia de gestão de projetos (PMBOK/ágil)",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-s2e-2-pol-2",
            "name": "Política de indicadores institucionais",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% projetos no prazo/orçamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Benefícios capturados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          }
        ],
        "systems": [
          "ClickUp ou Jira (já presentes na casa) para portfólio (sugerido)",
          "Power BI (sugerido)",
          "Power BI sobre Databricks (sugerido)"
        ],
        "painPoints": [
          "L2 sem macroprocesso AS-IS — capacidade inexistente ou informal hoje",
          "Requer definição de dono, processo e ferramenta"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2e-2-1",
            "name": "Gerir Portfólio de Projetos Estratégicos",
            "code": "S2E.2.1",
            "description": "Prioriza, acompanha e captura benefícios das iniciativas estratégicas.",
            "objective": "Prioriza, acompanha e captura benefícios das iniciativas estratégicas.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 S2E.2 Gerir Portfólio e Desempenho.",
            "scopeBoundary": "Atividades L4 propostas: Priorizar e aprovar portfólio de iniciativas ; Acompanhar execução e benefícios do portfólio .",
            "inputs": "Diretrizes estratégicas e normativas do L1 S2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 S2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-s2e-2-1-pol-1",
                "name": "Metodologia de gestão de projetos (PMBOK/ágil)",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "ClickUp ou Jira (já presentes na casa) para portfólio (sugerido)",
              "Power BI (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-2-1-1",
                "name": "Priorizar e aprovar portfólio de iniciativas",
                "code": "S2E.2.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.2.1 Gerir Portfólio de Projetos Estratégicos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-2-1-2",
                "name": "Acompanhar execução e benefícios do portfólio",
                "code": "S2E.2.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.2.1 Gerir Portfólio de Projetos Estratégicos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-s2e-2-2",
            "name": "Monitorar Desempenho Institucional",
            "code": "S2E.2.2",
            "description": "Mede e reporta resultados institucionais à governança.",
            "objective": "Mede e reporta resultados institucionais à governança.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 S2E.2 Gerir Portfólio e Desempenho.",
            "scopeBoundary": "Atividades L4 propostas: Definir e manter painel de indicadores institucionais ; Conduzir rituais de análise de resultados .",
            "inputs": "Diretrizes estratégicas e normativas do L1 S2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 S2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-s2e-2-2-pol-1",
                "name": "Política de indicadores institucionais",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "Power BI sobre Databricks (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-2-2-1",
                "name": "Definir e manter painel de indicadores institucionais",
                "code": "S2E.2.2.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.2.2 Monitorar Desempenho Institucional.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-2-2-2",
                "name": "Conduzir rituais de análise de resultados",
                "code": "S2E.2.2.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.2.2 Monitorar Desempenho Institucional.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-s2e-3",
        "name": "Gerir Capacidades e Conhecimento",
        "code": "S2E.3",
        "description": "Manter a arquitetura de processos e o conhecimento/acervo documental da associação.",
        "objective": "Manter a arquitetura de processos e o conhecimento/acervo documental da associação.",
        "valueProposition": "Memória institucional preservada e processos claros, reduzindo dependência de pessoas.",
        "scopeBoundary": "Compreende os L3: S2E.3.1 Gerir Arquitetura de Processos; S2E.3.2 Gerir Conhecimento e Acervo Documental. Insere-se no L1 S2E e se limita às atividades descritas nesses L3.",
        "inputs": "Apresentações, atas de reunião, ofícios, cartas, planilhas, estudos, materiais… Fornecedores: Áreas internas e associados.",
        "outputs": "Repositório organizado e atualizado de documentos, materiais de apoio e histórico das…",
        "stakeholders": "Áreas executoras: Representação de Mercados. Destinos: Áreas internas.",
        "responsible": "Representação de Mercados",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 50,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% processos críticos documentados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% acervo catalogado",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Novo Sistema Organismos"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-206",
          "Dependência de terceiros: Microsoft"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2e-3-1",
            "name": "Gerir Arquitetura de Processos",
            "code": "S2E.3.1",
            "description": "Mantém cadeia de valor, processos documentados e melhoria contínua.",
            "objective": "Mantém cadeia de valor, processos documentados e melhoria contínua.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 S2E.3 Gerir Capacidades e Conhecimento.",
            "scopeBoundary": "Atividades L4 propostas: Manter cadeia de valor e arquitetura de processos ; Documentar e melhorar processos .",
            "inputs": "Diretrizes estratégicas e normativas do L1 S2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 S2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-s2e-3-1-pol-1",
                "name": "Cadeia de Valor TO-BE",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-s2e-3-1-pol-2",
                "name": "padrão BPMN",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-s2e-3-1-pol-3",
                "name": "APQC PCF",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "Repositório de processos (Fluig BPM ou ferramenta de modelagem BPMN) (sugerido)",
              "SharePoint (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-3-1-1",
                "name": "Manter cadeia de valor e arquitetura de processos",
                "code": "S2E.3.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.3.1 Gerir Arquitetura de Processos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2e-3-1-2",
                "name": "Documentar e melhorar processos",
                "code": "S2E.3.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2E.3.1 Gerir Arquitetura de Processos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-s2e-3-2",
            "name": "Gerir Conhecimento e Acervo Documental",
            "code": "S2E.3.2",
            "description": "Organiza e preserva conteúdos e documentos corporativos.",
            "objective": "Organiza e preserva conteúdos e documentos corporativos.",
            "valueProposition": "Armazenar, organizar, compartilhar e preservar documentos e materiais produzidos ou…",
            "scopeBoundary": "Atividades L4: Gerir documentos e conteúdos em repositórios corporativos. Macroprocessos AS-IS: OP-206.",
            "inputs": "Apresentações, atas de reunião, ofícios, cartas, planilhas, estudos, materiais… Fornecedores: Áreas internas e associados.",
            "outputs": "Repositório organizado e atualizado de documentos, materiais de apoio e histórico das…",
            "stakeholders": "Áreas executoras: Representação de Mercados. Destinos: Áreas internas.",
            "responsible": "Representação de Mercados",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Novo Sistema Organismos"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-206",
              "Dependência de terceiros: Microsoft"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-206"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-s2e-3-2-1",
                "name": "Gerir documentos e conteúdos em repositórios corporativos",
                "code": "S2E.3.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-206).",
                "scopeBoundary": "Atividade do L3 S2E.3.2 Gerir Conhecimento e Acervo Documental.",
                "responsible": "Representação de Mercados",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-grc",
    "name": "Governança, Riscos e Conformidade",
    "code": "GRC",
    "domain": "Processo de Gestão",
    "category": "SUPPORT",
    "description": "Proteger a associação por meio da gestão integrada de riscos corporativos, controles internos, continuidade de negócios, integridade, privacidade de dados e assuntos jurídicos, assegurando conformidade legal, regulatória e ética.",
    "objective": "Proteger a associação por meio da gestão integrada de riscos corporativos, controles internos, continuidade de negócios, integridade, privacidade de dados e assuntos jurídicos, assegurando conformidade legal, regulatória e ética.",
    "valueProposition": "Reduzir a exposição da ANBIMA a perdas financeiras, sanções, litígios e danos reputacionais, sustentando a credibilidade da associação como autorreguladora e provedora de referências do mercado.",
    "scopeBoundary": "Inclui identificação, avaliação e tratamento de riscos; desenho e teste de controles; auditoria interna; plano de continuidade (BIA, contingências e testes); programa de integridade e canal de denúncias; LGPD; consultoria jurídica e contencioso. Não inclui a autorregulação do mercado (R2E) nem a segurança da informação técnica (TEC), com as quais se articula.",
    "inputs": "Mapa de processos e criticidade (S2E); incidentes, denúncias e relatos; legislação e regulação aplicável (LGPD, anticorrupção); contratos e demandas jurídicas; resultados de auditorias; dados de terceiros e fornecedores.",
    "outputs": "Matriz de riscos e controles; relatórios de auditoria e planos de ação; plano de continuidade testado; normativos e treinamentos de integridade; tratamento de denúncias e due diligence de terceiros; respostas a titulares (LGPD); pareceres, contratos revisados e gestão de processos judiciais.",
    "stakeholders": "Compliance; Jurídico; Assessoria Jurídica; Gestão de Riscos/Controles; Tecnologia (segurança); Conselho Fiscal e Comitê de Auditoria. Destinos: Diretoria e Conselho, todas as áreas, titulares de dados, órgãos públicos e Judiciário.",
    "responsible": "Compliance, Jurídico",
    "businessUnit": "Processos de Gestão",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 63,
    "policies": [
      {
        "id": "anb-l1-grc-pol-1",
        "name": "LGPD (Lei 13.709/2018)",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-grc-pol-2",
        "name": "Lei Anticorrupção (12.846/2013)",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-grc-pol-3",
        "name": "Código de Ética e Conduta ANBIMA",
        "type": "Autorregulação ANBIMA",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-grc-pol-4",
        "name": "política de integridade, de privacidade e de gestão de riscos",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-grc-pol-5",
        "name": "ISO 31000 / ISO 22301 (referência)",
        "type": "Referência de Mercado",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-grc-pol-6",
        "name": "COSO",
        "type": "Referência de Mercado",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "% de riscos altos com plano de ação",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de controles testados efetivos",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "RTO/RPO testados vs. meta",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Prazo de resposta LGPD (≤ 15 dias)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% colaboradores treinados em integridade",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Nº de processos judiciais e provisão",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "BeCompliance",
      "Jira",
      "KnowBe4",
      "Workvivo",
      "Portal ANBIMA",
      "Fluig",
      "Netlex",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: BeCompliance como plataforma GRC central (riscos, controles, integridade, LGPD)",
      "TO-BE: KnowBe4 para treinamentos",
      "TO-BE: Netlex para gestão jurídica (consultivo e contencioso)",
      "TO-BE: Jira para workflow de demandas",
      "TO-BE: SharePoint para normativos"
    ],
    "painPoints": [
      "Gestão de riscos corporativos, controles internos e continuidade são lacunas no AS-IS (sem macroprocesso mapeado)",
      "A pesquisa indica muitos macroprocessos sem plano de contingência formal na associação como um todo",
      "Risco de visão fragmentada de riscos e de dependência de fornecedores externos (BeCompliance, OpiceBlum)"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-grc-1",
        "name": "Gerir Riscos e Controles",
        "code": "GRC.1",
        "description": "Identificar, avaliar e tratar riscos corporativos e garantir controles internos efetivos.",
        "objective": "Identificar, avaliar e tratar riscos corporativos e garantir controles internos efetivos.",
        "valueProposition": "Menor exposição a perdas e maior segurança para a governança.",
        "scopeBoundary": "Compreende os L3: GRC.1.1 Gerir Riscos Corporativos; GRC.1.2 Gerir Controles Internos e Auditoria. Insere-se no L1 GRC e se limita às atividades descritas nesses L3.",
        "inputs": "Diretrizes do L1 GRC; ver detalhamento nos L3.",
        "outputs": "Identifica, avalia, trata e reporta riscos corporativos; Desenha e testa controles e coordena auditorias internas.",
        "stakeholders": "Área responsável a definir (sem macroprocesso AS-IS).",
        "responsible": "A definir",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "pending",
        "contextValidationPercent": 0,
        "policies": [
          {
            "id": "anb-l2-grc-1-pol-1",
            "name": "ISO 31000",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-1-pol-2",
            "name": "COSO ERM",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-1-pol-3",
            "name": "política de gestão de riscos",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-1-pol-4",
            "name": "COSO",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-1-pol-5",
            "name": "normas IIA de auditoria interna",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% riscos altos com plano",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% controles efetivos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          }
        ],
        "systems": [
          "BeCompliance (módulo de riscos) (sugerido)",
          "Power BI (sugerido)",
          "BeCompliance (controles e auditoria) (sugerido)",
          "SharePoint (sugerido)"
        ],
        "painPoints": [
          "L2 sem macroprocesso AS-IS — capacidade inexistente ou informal hoje",
          "Requer definição de dono, processo e ferramenta"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-grc-1-1",
            "name": "Gerir Riscos Corporativos",
            "code": "GRC.1.1",
            "description": "Identifica, avalia, trata e reporta riscos corporativos.",
            "objective": "Identifica, avalia, trata e reporta riscos corporativos.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 GRC.1 Gerir Riscos e Controles.",
            "scopeBoundary": "Atividades L4 propostas: Identificar e avaliar riscos corporativos ; Monitorar riscos e planos de tratamento ; Reportar riscos à governança.",
            "inputs": "Diretrizes estratégicas e normativas do L1 GRC; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 GRC.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-grc-1-1-pol-1",
                "name": "ISO 31000",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-grc-1-1-pol-2",
                "name": "COSO ERM",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-grc-1-1-pol-3",
                "name": "política de gestão de riscos",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "BeCompliance (módulo de riscos) (sugerido)",
              "Power BI (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-grc-1-1-1",
                "name": "Identificar e avaliar riscos corporativos",
                "code": "GRC.1.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.1.1 Gerir Riscos Corporativos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-1-1-2",
                "name": "Monitorar riscos e planos de tratamento",
                "code": "GRC.1.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.1.1 Gerir Riscos Corporativos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-1-1-3",
                "name": "Reportar riscos à governança",
                "code": "GRC.1.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.1.1 Gerir Riscos Corporativos.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-grc-1-2",
            "name": "Gerir Controles Internos e Auditoria",
            "code": "GRC.1.2",
            "description": "Desenha e testa controles e coordena auditorias internas.",
            "objective": "Desenha e testa controles e coordena auditorias internas.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 GRC.1 Gerir Riscos e Controles.",
            "scopeBoundary": "Atividades L4 propostas: Desenhar e testar controles internos ; Coordenar auditoria interna e tratar apontamentos .",
            "inputs": "Diretrizes estratégicas e normativas do L1 GRC; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 GRC.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-grc-1-2-pol-1",
                "name": "COSO",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-grc-1-2-pol-2",
                "name": "normas IIA de auditoria interna",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "BeCompliance (controles e auditoria) (sugerido)",
              "SharePoint (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-grc-1-2-1",
                "name": "Desenhar e testar controles internos",
                "code": "GRC.1.2.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.1.2 Gerir Controles Internos e Auditoria.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-1-2-2",
                "name": "Coordenar auditoria interna e tratar apontamentos",
                "code": "GRC.1.2.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.1.2 Gerir Controles Internos e Auditoria.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-grc-2",
        "name": "Gerir Continuidade e Resiliência",
        "code": "GRC.2",
        "description": "Garantir a continuidade dos macroprocessos críticos diante de incidentes.",
        "objective": "Garantir a continuidade dos macroprocessos críticos diante de incidentes.",
        "valueProposition": "Publicações e serviços críticos mantidos mesmo em crise.",
        "scopeBoundary": "Compreende os L3: GRC.2.1 Gerir Continuidade de Negócios. Insere-se no L1 GRC e se limita às atividades descritas nesses L3.",
        "inputs": "Diretrizes do L1 GRC; ver detalhamento nos L3.",
        "outputs": "Analisa impacto, define contingências e testa a capacidade de recuperação dos macroprocessos críticos.",
        "stakeholders": "Área responsável a definir (sem macroprocesso AS-IS).",
        "responsible": "A definir",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "pending",
        "contextValidationPercent": 0,
        "policies": [
          {
            "id": "anb-l2-grc-2-pol-1",
            "name": "ISO 22301",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-2-pol-2",
            "name": "Princípios IOSCO (continuidade de benchmarks)",
            "type": "Norma Regulatória",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% processos críticos com plano testado",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "RTO atingido",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          }
        ],
        "systems": [
          "BeCompliance ou ferramenta de BCM (sugerido)",
          "plataforma de backup (TEC.4) (sugerido)"
        ],
        "painPoints": [
          "L2 sem macroprocesso AS-IS — capacidade inexistente ou informal hoje",
          "Requer definição de dono, processo e ferramenta"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-grc-2-1",
            "name": "Gerir Continuidade de Negócios",
            "code": "GRC.2.1",
            "description": "Analisa impacto, define contingências e testa a capacidade de recuperação dos macroprocessos críticos.",
            "objective": "Analisa impacto, define contingências e testa a capacidade de recuperação dos macroprocessos críticos.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 GRC.2 Gerir Continuidade e Resiliência.",
            "scopeBoundary": "Atividades L4 propostas: Conduzir análise de impacto no negócio (BIA) ; Definir estratégias e planos de contingência ; Testar e manter planos de continuidade ; Gerir crises e comunicação de crise .",
            "inputs": "Diretrizes estratégicas e normativas do L1 GRC; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 GRC.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-grc-2-1-pol-1",
                "name": "ISO 22301",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-grc-2-1-pol-2",
                "name": "Princípios IOSCO (continuidade de benchmarks)",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "BeCompliance ou ferramenta de BCM (sugerido)",
              "plataforma de backup (TEC.4) (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-grc-2-1-1",
                "name": "Conduzir análise de impacto no negócio (BIA)",
                "code": "GRC.2.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.2.1 Gerir Continuidade de Negócios.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-2-1-2",
                "name": "Definir estratégias e planos de contingência",
                "code": "GRC.2.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.2.1 Gerir Continuidade de Negócios.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-2-1-3",
                "name": "Testar e manter planos de continuidade",
                "code": "GRC.2.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.2.1 Gerir Continuidade de Negócios.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-2-1-4",
                "name": "Gerir crises e comunicação de crise",
                "code": "GRC.2.1.4",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.2.1 Gerir Continuidade de Negócios.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-grc-3",
        "name": "Gerir Integridade e Compliance",
        "code": "GRC.3",
        "description": "Manter o programa de integridade, monitorar condutas e assegurar a conformidade com a LGPD.",
        "objective": "Manter o programa de integridade, monitorar condutas e assegurar a conformidade com a LGPD.",
        "valueProposition": "Cultura ética e proteção de dados que sustentam a credibilidade da autorreguladora.",
        "scopeBoundary": "Compreende os L3: GRC.3.1 Gerir Programa de Integridade; GRC.3.2 Monitorar Condutas e Riscos de Integridade; GRC.3.3 Gerir Privacidade e Proteção de Dados. Insere-se no L1 GRC e se limita às atividades descritas nesses L3.",
        "inputs": "Política anterior, legislações e procedimentos novos; Apresentação em PowerPoint e formulário online (via Microsoft forms). Fornecedores: Área interna; Colaboradores; Além do insumo da área interna (comunicações internas], há a particiáção de uma…; : Recebeminto via relatórios da plataforma BeCompliance, email ou telefonemas.",
        "outputs": "Política/Normativo interno; Conscientização acerca dos pilares de compliance.",
        "stakeholders": "Áreas executoras: Compliance, Jurídico. Destinos: Áreas internas; Colaboradores; : Comitê de ética; Compliance e assesoria jurídica (DPO DPO suplente), áreas internas e entidades…; Pessoas físicas com relacionamento anbima.",
        "responsible": "Compliance, Jurídico",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-grc-3-pol-1",
            "name": "De forma autorregulatória devemos atualizar nossas políticas a cada 2 anos ou menos em…",
            "type": "Autorregulação ANBIMA",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-grc-3-pol-2",
            "name": "legal - lei LGPD - 15 dias corridos para responder ao titular de dados pessoais",
            "type": "Norma Regulatória",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% treinados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Prazo de resposta a titulares",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Denúncias tratadas no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 8, Moderado: 2, Crítico: 2",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "BeCompliance",
          "Microsoft Outlook",
          "Microsoft SharePoint",
          "Microsoft Word",
          "Jira",
          "KnowBe4",
          "Workvivo",
          "Portal ANBIMA"
        ],
        "painPoints": [
          "2 de 12 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 8 macroprocesso(s) (OP-065, OP-067, OP-068, OP-069, OP-070, OP-071, OP-072, OP-073)",
          "Procedimento não documentado ou só informal em OP-066, OP-074, OP-075, OP-089",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-grc-3-1",
            "name": "Gerir Programa de Integridade",
            "code": "GRC.3.1",
            "description": "Mantém normativos, capacitação e cultura de integridade.",
            "objective": "Mantém normativos, capacitação e cultura de integridade.",
            "valueProposition": "Elaborar, revisar, aprovar e divulgar políticas, normas, cartilhas e códigos do programa / Orientar novos colaboradores sobre Compliance, Segurança da Informação, LGPD e IA… / Disponibilizar e acompanhar treinamentos de Compliance.",
            "scopeBoundary": "Atividades L4: Gerir documentos e normativos de integridade; Integrar colaboradores ao programa de integridade; Capacitar em integridade; Comunicar cultura de integridade. Macroprocessos AS-IS: OP-065, OP-067, OP-068, OP-069.",
            "inputs": "Política anterior, legislações e procedimentos novos; Apresentação em PowerPoint e formulário online (via Microsoft forms). Fornecedores: Área interna; Além do insumo da área interna (comunicações internas], há a particiáção de uma…",
            "outputs": "Política/Normativo interno; Conscientização acerca dos pilares de compliance.",
            "stakeholders": "Áreas executoras: Compliance. Destinos: Áreas internas; Colaboradores.",
            "responsible": "Compliance",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-grc-3-1-pol-1",
                "name": "De forma autorregulatória devemos atualizar nossas políticas a cada 2 anos ou menos em…",
                "type": "Autorregulação ANBIMA",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Semanal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 3, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Microsoft Word",
              "BeCompliance",
              "KnowBe4",
              "Workvivo"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 4 macroprocesso(s) (OP-065, OP-067, OP-068, OP-069)",
              "Impactos/penalidades declarados: Não há penalidade formal",
              "Aplicação de multa pela CGU",
              "Dependência de terceiros: Sim, BeCompliance e KnoeBe4",
              "Sim, Intertéia, WebDefense e KnowBe4"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-065, OP-067, OP-068, OP-069"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-grc-3-1-1",
                "name": "Gerir documentos e normativos de integridade",
                "code": "GRC.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                "scopeBoundary": "Atividade do L3 GRC.3.1 Gerir Programa de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-1-2",
                "name": "Integrar colaboradores ao programa de integridade",
                "code": "GRC.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                "scopeBoundary": "Atividade do L3 GRC.3.1 Gerir Programa de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-1-3",
                "name": "Capacitar em integridade",
                "code": "GRC.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                "scopeBoundary": "Atividade do L3 GRC.3.1 Gerir Programa de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-1-4",
                "name": "Comunicar cultura de integridade",
                "code": "GRC.3.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                "scopeBoundary": "Atividade do L3 GRC.3.1 Gerir Programa de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-grc-3-2",
            "name": "Monitorar Condutas e Riscos de Integridade",
            "code": "GRC.3.2",
            "description": "Monitora condutas, terceiros e riscos do programa de integridade.",
            "objective": "Monitora condutas, terceiros e riscos do programa de integridade.",
            "valueProposition": "Apurar relatos de forma imparcial e subsidiar deliberações / Controlar o registro das interações com agentes públicos e verificar aderência à… / Controlar declarações de recebimento e oferecimento de cortesias conforme a política…",
            "scopeBoundary": "Atividades L4: Gerir canal de denúncias; Monitorar interações com o poder público; Gerir cortesias, brindes e patrocínios; Gerir conflitos de interesse e defesa da concorrência; Avaliar terceiros, tecnologia e IA em contratações; Mapear e monitorar riscos de compliance. Macroprocessos AS-IS: OP-066, OP-070, OP-071, OP-072, OP-073, OP-074.",
            "inputs": "Relatórios recebidos pela plataforma, relatos escritos, relatos verbais, imagens,…; Planilha em excel. Fornecedores: Área interna; Colaboradores; : Recebeminto via relatórios da plataforma BeCompliance, email ou telefonemas.",
            "outputs": "Relato registrado e direcionado; Registro e conformidade para eventuais auditorias e questionamentos legais.",
            "stakeholders": "Áreas executoras: Compliance. Destinos: Áreas internas; Colaboradores; : Comitê de ética.",
            "responsible": "Compliance",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 5, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "BeCompliance",
              "Microsoft Outlook",
              "Portal ANBIMA",
              "Jira",
              "Microsoft SharePoint",
              "Microsoft Word"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 4 macroprocesso(s) (OP-070, OP-071, OP-072, OP-073)",
              "Procedimento não documentado ou só informal em OP-066, OP-074",
              "Dependência de terceiros: Sim, BeCompliance",
              "Sistema Jira"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-066, OP-070, OP-071, OP-072, OP-073, OP-074"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-grc-3-2-1",
                "name": "Gerir canal de denúncias",
                "code": "GRC.3.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-2-2",
                "name": "Monitorar interações com o poder público",
                "code": "GRC.3.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-2-3",
                "name": "Gerir cortesias, brindes e patrocínios",
                "code": "GRC.3.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-2-4",
                "name": "Gerir conflitos de interesse e defesa da concorrência",
                "code": "GRC.3.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-2-5",
                "name": "Avaliar terceiros, tecnologia e IA em contratações",
                "code": "GRC.3.2.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-2-6",
                "name": "Mapear e monitorar riscos de compliance",
                "code": "GRC.3.2.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                "scopeBoundary": "Atividade do L3 GRC.3.2 Monitorar Condutas e Riscos de Integridade.",
                "responsible": "Compliance",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-grc-3-3",
            "name": "Gerir Privacidade e Proteção de Dados",
            "code": "GRC.3.3",
            "description": "Garante conformidade com a LGPD.",
            "objective": "Garante conformidade com a LGPD.",
            "valueProposition": "Assegurar a conformidade com a LGPD por meio do mapeamento, monitoramento e… / Responder aos questionamentos do titular de dados.",
            "scopeBoundary": "Atividades L4: Manter ROPA e programa de privacidade; Atender solicitações de titulares de dados; Gerir incidentes de privacidade . Macroprocessos AS-IS: OP-075, OP-089.",
            "inputs": "Planilhas em Excel e formulários eletrônicos disponibilizados pela plataforma; pedidos do titular de dados -. Fornecedores: Área interna; Pessoas físicas com relacionamento anbima.",
            "outputs": "Mapeamento dos riscos e conformidade regulatória e com a política interna; atender ao pedido do titular dos dados.",
            "stakeholders": "Áreas executoras: Compliance, Jurídico. Destinos: Compliance e assesoria jurídica (DPO DPO suplente), áreas internas e entidades…; Pessoas físicas com relacionamento anbima.",
            "responsible": "Compliance, Jurídico",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-grc-3-3-pol-1",
                "name": "legal - lei LGPD - 15 dias corridos para responder ao titular de dados pessoais",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "BeCompliance",
              "Jira",
              "Microsoft Excel",
              "Microsoft SharePoint",
              "Microsoft Word"
            ],
            "painPoints": [
              "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-075, OP-089",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Aplicação de multa pela ANPD",
              "Multa da LGPD se o titular dos dados se sentir prejudicado",
              "Dependência de terceiros: Sim, BeCompliance (gestão de processos) e OpiceBlum (assessoria jurídica)"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-075, OP-089"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-grc-3-3-1",
                "name": "Manter ROPA e programa de privacidade",
                "code": "GRC.3.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-075, OP-089).",
                "scopeBoundary": "Atividade do L3 GRC.3.3 Gerir Privacidade e Proteção de Dados.",
                "responsible": "Compliance, Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-3-2",
                "name": "Atender solicitações de titulares de dados",
                "code": "GRC.3.3.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-075, OP-089).",
                "scopeBoundary": "Atividade do L3 GRC.3.3 Gerir Privacidade e Proteção de Dados.",
                "responsible": "Compliance, Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-grc-3-3-3",
                "name": "Gerir incidentes de privacidade",
                "code": "GRC.3.3.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 GRC.3.3 Gerir Privacidade e Proteção de Dados.",
                "responsible": "Compliance, Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-grc-4",
        "name": "Gerir Assuntos Jurídicos",
        "code": "GRC.4",
        "description": "Prestar consultoria jurídica e conduzir o contencioso da associação.",
        "objective": "Prestar consultoria jurídica e conduzir o contencioso da associação.",
        "valueProposition": "Segurança jurídica em contratos e defesa eficaz em litígios.",
        "scopeBoundary": "Compreende os L3: GRC.4.1 Prestar Consultoria Jurídica; GRC.4.2 Gerir Contencioso. Insere-se no L1 GRC e se limita às atividades descritas nesses L3.",
        "inputs": "contratos, termos, declarações, etc; documentos. Fornecedores: Área interna.",
        "outputs": "documento analisado; defesa ou petição inicial.",
        "stakeholders": "Áreas executoras: Jurídico. Destinos: Áreas internas.",
        "responsible": "Jurídico",
        "businessUnit": "Processos de Gestão",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-grc-4-pol-1",
            "name": "depende do ato",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Tempo médio de parecer",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Êxito em ações",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1, Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Fluig",
          "Microsoft Excel",
          "Microsoft SharePoint",
          "Microsoft Word",
          "Netlex"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-094)",
          "Procedimento não documentado ou só informal em OP-088",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Impactos/penalidades declarados: pode perder o fornecedor",
          "Perder prazo - significa perdar a ação"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-grc-4-1",
            "name": "Prestar Consultoria Jurídica",
            "code": "GRC.4.1",
            "description": "Analisa contratos e documentos jurídicos da associação.",
            "objective": "Analisa contratos e documentos jurídicos da associação.",
            "valueProposition": "Assegurar a conformidade jurídica dos documentos e mitigar riscos legais para a ANBIMA.",
            "scopeBoundary": "Atividades L4: Analisar contratos, termos e documentos jurídicos. Macroprocessos AS-IS: OP-088.",
            "inputs": "contratos, termos, declarações, etc. Fornecedores: Área interna.",
            "outputs": "documento analisado.",
            "stakeholders": "Áreas executoras: Jurídico. Destinos: Áreas internas.",
            "responsible": "Jurídico",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Fluig",
              "Microsoft Excel",
              "Microsoft SharePoint",
              "Microsoft Word",
              "Netlex"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-088",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: pode perder o fornecedor"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-088"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-grc-4-1-1",
                "name": "Analisar contratos, termos e documentos jurídicos",
                "code": "GRC.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-088).",
                "scopeBoundary": "Atividade do L3 GRC.4.1 Prestar Consultoria Jurídica.",
                "responsible": "Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-grc-4-2",
            "name": "Gerir Contencioso",
            "code": "GRC.4.2",
            "description": "Conduz ações judiciais e administrativas.",
            "objective": "Conduz ações judiciais e administrativas.",
            "valueProposition": "Acompanhar e conduzir a defesa dos interesses da ANBIMA em processos judiciais, tanto…",
            "scopeBoundary": "Atividades L4: Gerir contencioso judicial e administrativo. Macroprocessos AS-IS: OP-094.",
            "inputs": "documentos. Fornecedores: Área interna.",
            "outputs": "defesa ou petição inicial.",
            "stakeholders": "Áreas executoras: Jurídico. Destinos: Áreas internas.",
            "responsible": "Jurídico",
            "businessUnit": "Processos de Gestão",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-grc-4-2-pol-1",
                "name": "depende do ato",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-094)",
              "Impactos/penalidades declarados: perder prazo - significa perdar a ação",
              "Dependência de terceiros: Escritório externo pode ajudar demanda"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-094"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-grc-4-2-1",
                "name": "Gerir contencioso judicial e administrativo",
                "code": "GRC.4.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-094).",
                "scopeBoundary": "Atividade do L3 GRC.4.2 Gerir Contencioso.",
                "responsible": "Jurídico",
                "businessUnit": "Processos de Gestão",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-i2a",
    "name": "Agenda a Representação",
    "code": "I2A",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Transformar a agenda regulatória e legislativa em posicionamentos construídos com os associados e defendidos junto a reguladores, poder público e organismos internacionais.",
    "objective": "Transformar a agenda regulatória e legislativa em posicionamentos construídos com os associados e defendidos junto a reguladores, poder público e organismos internacionais.",
    "valueProposition": "Dar voz única e tecnicamente fundamentada ao mercado, influenciando a regulação para que seja eficiente, proporcional e favorável ao desenvolvimento do mercado de capitais.",
    "scopeBoundary": "Abrange o monitoramento da agenda regulatória e legislativa, a operação dos organismos de representação (comitês, fóruns, GTs), a construção de posicionamentos com associados e a defesa institucional nacional e internacional. A divulgação sistemática e avaliação da representação foi retirada do escopo TO-BE.",
    "inputs": "Publicações de CVM, Bacen, Legislativo e organismos internacionais; demandas e pautas de associados; estudos e dados de mercado (C2P, I2I); diretrizes estratégicas (S2E).",
    "outputs": "Agenda priorizada de temas; atas e deliberações de comitês; posicionamentos, ofícios e respostas a audiências públicas; participação em fóruns internacionais; registro de representação.",
    "stakeholders": "Representação de Mercados; Assessoria Jurídica; Diretoria e Presidência; comitês e fóruns de associados. Destinos: CVM, Bacen, Congresso, Executivo, IOSCO/organismos internacionais, associados.",
    "responsible": "Assessoria Jurídica, Representação de Mercados",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-i2a-pol-1",
        "name": "Estatuto e regimentos dos organismos de representação",
        "type": "Estatuto / Regimento",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-i2a-pol-2",
        "name": "política de representação institucional",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-i2a-pol-3",
        "name": "normas de audiência pública da CVM e do Bacen",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "% de posicionamentos acolhidos total/parcialmente",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Nº de audiências públicas respondidas no prazo",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Taxa de participação nos comitês",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Tempo entre publicação regulatória e posicionamento",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Novo Sistema Organismos",
      "Portal de Documentos (PDTec / PDSign)",
      "BeCompliance",
      "Brevo",
      "Open Metadata",
      "Microsoft Copilot",
      "Sistema interno de registro de ofícios",
      "Numeração: desconhecido",
      "Portal ANBIMA",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Novo Sistema Organismos (Orla) como núcleo de comitês",
      "TO-BE: membros e deliberações",
      "TO-BE: Teams/Copilot para reuniões e atas",
      "TO-BE: PDTec/PDSign para assinatura de ofícios",
      "TO-BE: SharePoint como acervo",
      "TO-BE: Brevo para circulares"
    ],
    "painPoints": [
      "Registro de ofícios em sistema interno com numeração pouco controlada",
      "Dependência de provedor do Novo Sistema Organismos",
      "Conhecimento concentrado em poucas pessoas",
      "Dificuldade de medir efetividade da representação"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-i2a-1",
        "name": "Monitorar Agenda Regulatória",
        "code": "I2A.1",
        "description": "Monitorar legislação e regulação e priorizar temas de interesse do mercado.",
        "objective": "Monitorar legislação e regulação e priorizar temas de interesse do mercado.",
        "valueProposition": "Antecipação de mudanças regulatórias relevantes para associados.",
        "scopeBoundary": "Compreende os L3: I2A.1.1 Monitorar e Analisar Temas. Insere-se no L1 I2A e se limita às atividades descritas nesses L3.",
        "inputs": "Leis, decretos, notícias, situações específicas de associados, decissão judicial,…; Planilha de insumos e classificação (Interna). Fornecedores: Área interna; Reguladores (BCB/CVM).",
        "outputs": "Endereçamento do tema; Relatório.",
        "stakeholders": "Áreas executoras: Assessoria Jurídica, Representação de Mercados. Destinos: Áreas internas; Mercado em geral.",
        "responsible": "Assessoria Jurídica, Representação de Mercados",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Tempo entre publicação e triagem",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Nº temas priorizados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Brevo"
        ],
        "painPoints": [
          "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-210)",
          "Procedimento não documentado ou só informal em OP-081"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-i2a-1-1",
            "name": "Monitorar e Analisar Temas",
            "code": "I2A.1.1",
            "description": "Acompanha legislação e regulação e prioriza temas de interesse do mercado.",
            "objective": "Acompanha legislação e regulação e prioriza temas de interesse do mercado.",
            "valueProposition": "Monitorar alterações na legislação e temas de interesse e identificar seus potenciais… / Atualização diária de inovações regulatórias (CVM, BCB, CMN).",
            "scopeBoundary": "Atividades L4: Acompanhar legislação e temas de interesse; Priorizar agenda regulatória da associação ; Disseminar informações regulatórias aos associados. Macroprocessos AS-IS: OP-081, OP-210.",
            "inputs": "Leis, decretos, notícias, situações específicas de associados, decissão judicial,…; Planilha de insumos e classificação (Interna). Fornecedores: Área interna; Reguladores (BCB/CVM).",
            "outputs": "Endereçamento do tema; Relatório.",
            "stakeholders": "Áreas executoras: Assessoria Jurídica, Representação de Mercados. Destinos: Áreas internas; Mercado em geral.",
            "responsible": "Assessoria Jurídica, Representação de Mercados",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Brevo"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-210)",
              "Procedimento não documentado ou só informal em OP-081"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-081, OP-210"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2a-1-1-1",
                "name": "Acompanhar legislação e temas de interesse",
                "code": "I2A.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-081, OP-210).",
                "scopeBoundary": "Atividade do L3 I2A.1.1 Monitorar e Analisar Temas.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-1-1-2",
                "name": "Priorizar agenda regulatória da associação",
                "code": "I2A.1.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 I2A.1.1 Monitorar e Analisar Temas.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-1-1-3",
                "name": "Disseminar informações regulatórias aos associados",
                "code": "I2A.1.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-081, OP-210).",
                "scopeBoundary": "Atividade do L3 I2A.1.1 Monitorar e Analisar Temas.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-i2a-2",
        "name": "Construir Posicionamento",
        "code": "I2A.2",
        "description": "Construir posicionamentos com os associados por meio dos organismos de representação.",
        "objective": "Construir posicionamentos com os associados por meio dos organismos de representação.",
        "valueProposition": "Posições legítimas e representativas do mercado.",
        "scopeBoundary": "Compreende os L3: I2A.2.1 Gerir Organismos de Representação; I2A.2.2 Conduzir Discussões com Associados. Insere-se no L1 I2A e se limita às atividades descritas nesses L3.",
        "inputs": "Cadastro dos participantes de mercado e cadastro e informações do grupo específico; Dados cadastrais dos participantes, informações dos organismos e parâmetros… Fornecedores: Área interna; Fornecedor/prestador externo.",
        "outputs": "Reunião agendada com visualização no e-mail do participante; Participante devidamente cadastrado para receber os convites e comunicações do grupo…",
        "stakeholders": "Áreas executoras: Representação de Mercados, Assessoria Jurídica. Destinos: Associados; Áreas internas; Destinatários incluem o mercado em geral e áreas internas; O macroprocesso atende comissões, grupos de trabalho, associados, instituições…; Entregas destinadas aos participantes da reunião, áreas internas interessadas e liderança.",
        "responsible": "Representação de Mercados, Assessoria Jurídica",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Participação nos comitês",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Posicionamentos aprovados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 4, Baixo: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Novo Sistema Organismos",
          "Microsoft SharePoint",
          "Microsoft Teams",
          "Open Metadata",
          "Microsoft Excel",
          "Microsoft PowerPoint",
          "Microsoft Word",
          "Microsoft Copilot"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 2 macroprocesso(s) (OP-211, OP-209)",
          "Procedimento não documentado ou só informal em OP-204, OP-205, OP-211, OP-079, OP-076",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Dependência de terceiros: Provedor do Sistema Organismos",
          "Provedor do Novo Sistema Organismos (Orla)"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-i2a-2-1",
            "name": "Gerir Organismos de Representação",
            "code": "I2A.2.1",
            "description": "Opera comitês, fóruns e grupos de trabalho com participantes do mercado.",
            "objective": "Opera comitês, fóruns e grupos de trabalho com participantes do mercado.",
            "valueProposition": "Gerenciar os organismos de representação, incluindo o agendamento de reuniões, o envio… / Gerenciar o cadastro de participantes nos organismos de representação e manter… / Consultar e extrair informações necessárias à gestão dos organismos, especialmente…",
            "scopeBoundary": "Atividades L4: Gerir sistema de organismos de representação; Implantar e gerir novo sistema de organismos; Gerir e consultar informações dos organismos [OP-211; OP-079]. Macroprocessos AS-IS: OP-204, OP-205, OP-211, OP-079.",
            "inputs": "Cadastro dos participantes de mercado e cadastro e informações do grupo específico; Dados cadastrais dos participantes, informações dos organismos e parâmetros… Fornecedores: Área interna; Fornecedor/prestador externo.",
            "outputs": "Reunião agendada com visualização no e-mail do participante; Participante devidamente cadastrado para receber os convites e comunicações do grupo…",
            "stakeholders": "Áreas executoras: Representação de Mercados, Assessoria Jurídica. Destinos: Associados; Áreas internas; Destinatários incluem o mercado em geral e áreas internas.",
            "responsible": "Representação de Mercados, Assessoria Jurídica",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 3, Baixo: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Novo Sistema Organismos",
              "Open Metadata",
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft SharePoint",
              "Microsoft Word"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-211)",
              "Procedimento não documentado ou só informal em OP-204, OP-205, OP-211, OP-079",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Dependência de terceiros: Provedor do Sistema Organismos",
              "Provedor do Novo Sistema Organismos (Orla)"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-204, OP-205, OP-211, OP-079"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2a-2-1-1",
                "name": "Gerir sistema de organismos de representação",
                "code": "I2A.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-204, OP-205, OP-211, OP-079).",
                "scopeBoundary": "Atividade do L3 I2A.2.1 Gerir Organismos de Representação.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-2-1-2",
                "name": "Implantar e gerir novo sistema de organismos",
                "code": "I2A.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-204, OP-205, OP-211, OP-079).",
                "scopeBoundary": "Atividade do L3 I2A.2.1 Gerir Organismos de Representação.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-2-1-3",
                "name": "Gerir e consultar informações dos organismos",
                "code": "I2A.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-211; OP-079).",
                "scopeBoundary": "Atividade do L3 I2A.2.1 Gerir Organismos de Representação.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-i2a-2-2",
            "name": "Conduzir Discussões com Associados",
            "code": "I2A.2.2",
            "description": "Realiza reuniões, registra deliberações e consolida posições.",
            "objective": "Realiza reuniões, registra deliberações e consolida posições.",
            "valueProposition": "Viabilizar reuniões virtuais com associados, membros de comissões, grupos de trabalho… / Realizar e Registrar o que foi discutido e quais as deliberações.",
            "scopeBoundary": "Atividades L4: Agendar e conduzir reuniões com associados; Registrar reuniões e atas; Consolidar posicionamento do mercado . Macroprocessos AS-IS: OP-209, OP-076.",
            "inputs": "Pautas, apresentações, documentos, manifestações de mercado e materiais de apoio; Pauta, gravação da reunião, transcrição do Copilot, anotações e material apresentado… Fornecedores: Área interna.",
            "outputs": "Reunião realizada; Ata, transcrição e lista de deliberações.",
            "stakeholders": "Áreas executoras: Representação de Mercados, Assessoria Jurídica. Destinos: O macroprocesso atende comissões, grupos de trabalho, associados, instituições…; Entregas destinadas aos participantes da reunião, áreas internas interessadas e liderança.",
            "responsible": "Representação de Mercados, Assessoria Jurídica",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1, Baixo: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Teams",
              "Microsoft Copilot",
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Novo Sistema Organismos"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-209)",
              "Procedimento não documentado ou só informal em OP-076",
              "Dependência de terceiros: Microsoft"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-209, OP-076"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2a-2-2-1",
                "name": "Agendar e conduzir reuniões com associados",
                "code": "I2A.2.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-209, OP-076).",
                "scopeBoundary": "Atividade do L3 I2A.2.2 Conduzir Discussões com Associados.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-2-2-2",
                "name": "Registrar reuniões e atas",
                "code": "I2A.2.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-209, OP-076).",
                "scopeBoundary": "Atividade do L3 I2A.2.2 Conduzir Discussões com Associados.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-2-2-3",
                "name": "Consolidar posicionamento do mercado",
                "code": "I2A.2.2.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 I2A.2.2 Conduzir Discussões com Associados.",
                "responsible": "Representação de Mercados, Assessoria Jurídica",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-i2a-3",
        "name": "Representar Institucionalmente",
        "code": "I2A.3",
        "description": "Representar a associação perante reguladores, poder público e organismos internacionais.",
        "objective": "Representar a associação perante reguladores, poder público e organismos internacionais.",
        "valueProposition": "Influência efetiva na regulação nacional e internacional.",
        "scopeBoundary": "Compreende os L3: I2A.3.1 Defender Posições junto a Reguladores e Poder Público; I2A.3.2 Atuar Internacionalmente. Insere-se no L1 I2A e se limita às atividades descritas nesses L3.",
        "inputs": "Solicitação, documentos de suporte, modelos, dados do destinatário e orientações da área; Minuta do documento/ofício e CPF, Nome e cargo dos assinantes. Fornecedores: Área interna; A área de Representação elabora o documento e encaminha à Superintendência. As…; Áreas internas e mercado em geral internacional.",
        "outputs": "Ofício elaborado, assinado, protocolado e arquivado; Documentos oficiais da Anbima.",
        "stakeholders": "Áreas executoras: Assessoria Jurídica, Representação de Mercados. Destinos: Mercado em geral; Áreas internas; O destinatário varia conforme o ofício e pode incluir áreas internas ou públicos externos; Recebem os documentos oficiais: reguladores e mercado em geral, uma vez que os…; Reporte destinado às áreas internas responsáveis pelo acompanhamento e conformidade.",
        "responsible": "Assessoria Jurídica, Representação de Mercados",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-i2a-3-pol-1",
            "name": "Não existe prazo formal associado, depende do documento a ser encaminhado (se resposta…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% posicionamentos acolhidos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Respostas a audiências no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 3, Baixo: 2, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Microsoft Excel",
          "Microsoft PowerPoint",
          "Microsoft Word",
          "Microsoft SharePoint",
          "Portal de Documentos (PDTec / PDSign)",
          "BeCompliance",
          "Sistema interno de registro de ofícios",
          "Numeração: desconhecido"
        ],
        "painPoints": [
          "1 de 6 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-203)",
          "Procedimento não documentado ou só informal em OP-078, OP-203, OP-077, OP-202, OP-215, OP-214",
          "Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-i2a-3-1",
            "name": "Defender Posições junto a Reguladores e Poder Público",
            "code": "I2A.3.1",
            "description": "Formaliza e defende posições junto a CVM, Bacen, Legislativo e demais autoridades.",
            "objective": "Formaliza e defende posições junto a CVM, Bacen, Legislativo e demais autoridades.",
            "valueProposition": "Elaborar, revisar, protocolar e obter a assinatura dos ofícios da área / Elaborar, formalizar e encaminhar ofícios, manifestações e posicionamentos… / Registrar e manter os reportes de agendas e reuniões externas no BeCompliance. Ex.:…",
            "scopeBoundary": "Atividades L4: Elaborar, protocolar e assinar ofícios [OP-078; OP-203]; Responder audiências e consultas públicas ; Registrar e reportar agendas externas [OP-077; OP-202]. Macroprocessos AS-IS: OP-078, OP-203, OP-077, OP-202.",
            "inputs": "Solicitação, documentos de suporte, modelos, dados do destinatário e orientações da área; Minuta do documento/ofício e CPF, Nome e cargo dos assinantes. Fornecedores: Área interna; A área de Representação elabora o documento e encaminha à Superintendência. As…",
            "outputs": "Ofício elaborado, assinado, protocolado e arquivado; Documentos oficiais da Anbima.",
            "stakeholders": "Áreas executoras: Assessoria Jurídica, Representação de Mercados. Destinos: Mercado em geral; Áreas internas; O destinatário varia conforme o ofício e pode incluir áreas internas ou públicos externos; Recebem os documentos oficiais: reguladores e mercado em geral, uma vez que os…",
            "responsible": "Assessoria Jurídica, Representação de Mercados",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-i2a-3-1-pol-1",
                "name": "Não existe prazo formal associado, depende do documento a ser encaminhado (se resposta…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 2, Crítico: 1, Baixo: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft SharePoint",
              "Microsoft Word",
              "Portal de Documentos (PDTec / PDSign)",
              "BeCompliance",
              "Sistema interno de registro de ofícios"
            ],
            "painPoints": [
              "1 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-203)",
              "Procedimento não documentado ou só informal em OP-078, OP-203, OP-077, OP-202",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: A possível penalidade é o não aceite das manifestações da associação (caso haja prazo…; dependência de terceiros: Assinatura: PDSign; Númeração: desconhecido",
              "Se tiver alguma indisposição ou erro na…; BeCompliance"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-078, OP-203, OP-077, OP-202"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2a-3-1-1",
                "name": "Elaborar, protocolar e assinar ofícios",
                "code": "I2A.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-078; OP-203).",
                "scopeBoundary": "Atividade do L3 I2A.3.1 Defender Posições junto a Reguladores e Poder Público.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-3-1-2",
                "name": "Responder audiências e consultas públicas",
                "code": "I2A.3.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 I2A.3.1 Defender Posições junto a Reguladores e Poder Público.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-3-1-3",
                "name": "Registrar e reportar agendas externas",
                "code": "I2A.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-077; OP-202).",
                "scopeBoundary": "Atividade do L3 I2A.3.1 Defender Posições junto a Reguladores e Poder Público.",
                "responsible": "Assessoria Jurídica, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-i2a-3-2",
            "name": "Atuar Internacionalmente",
            "code": "I2A.3.2",
            "description": "Representa a associação em fóruns e organismos internacionais.",
            "objective": "Representa a associação em fóruns e organismos internacionais.",
            "valueProposition": "Fortalecer a presença e a influência internacional da ANBIMA, acompanhar discussões… / Ampliar a visibilidade internacional da ANBIMA, manter um canal de contato com…",
            "scopeBoundary": "Atividades L4: Participar de fóruns e cooperação internacional; Publicar conteúdo institucional internacional. Macroprocessos AS-IS: OP-215, OP-214.",
            "inputs": "Convites, agendas, atas, e-mails, documentos de consulta, apresentações, briefings,…; Publicações da ANBIMA, dados de mercado, informações sobre eventos, notas técnicas,… Fornecedores: Área interna; Áreas internas e mercado em geral internacional.",
            "outputs": "Participação institucional da ANBIMA, contribuições técnicas, respostas a consultas,…; Matérias, notícias, guias, páginas institucionais, chamadas de eventos e conteúdos…",
            "stakeholders": "Áreas executoras: Representação de Mercados. Destinos: Público internacional; Público internacional, associados, parceiros institucionais, organismos…",
            "responsible": "Representação de Mercados",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1, Baixo: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft Word",
              "Microsoft Outlook",
              "Portal ANBIMA"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-215, OP-214",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-215, OP-214"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2a-3-2-1",
                "name": "Participar de fóruns e cooperação internacional",
                "code": "I2A.3.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-215, OP-214).",
                "scopeBoundary": "Atividade do L3 I2A.3.2 Atuar Internacionalmente.",
                "responsible": "Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2a-3-2-2",
                "name": "Publicar conteúdo institucional internacional",
                "code": "I2A.3.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-215, OP-214).",
                "scopeBoundary": "Atividade do L3 I2A.3.2 Atuar Internacionalmente.",
                "responsible": "Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-r2e",
    "name": "Regra a Supervisão",
    "code": "R2E",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Executar o ciclo completo de autorregulação: criar e manter regras, admitir e credenciar participantes, supervisionar e inspecionar o mercado e aplicar sanções, assegurando a aderência às melhores práticas.",
    "objective": "Executar o ciclo completo de autorregulação: criar e manter regras, admitir e credenciar participantes, supervisionar e inspecionar o mercado e aplicar sanções, assegurando a aderência às melhores práticas.",
    "valueProposition": "Elevar padrões éticos e técnicos do mercado, proteger investidores e reduzir a necessidade de regulação estatal adicional, reforçando a credibilidade da ANBIMA e de seus associados.",
    "scopeBoundary": "Começa na elaboração de códigos e regras e termina no cumprimento de penalidades; inclui adesão/filiação, habilitação via convênio CVM, supervisão baseada em risco, monitoramento analítico, a nova etapa de inspeções e a condução de processos sancionadores. O registro de produtos e ofertas foi retirado do escopo TO-BE.",
    "inputs": "Regulação CVM/Bacen; deliberações dos organismos (I2A); documentos de instituições requerentes; bases de fundos, carteiras e ofertas (C2P); denúncias e eventos de mercado.",
    "outputs": "Códigos e regras publicados; instituições admitidas e selos concedidos; participantes habilitados (convênio CVM); plano de supervisão; alertas e relatórios de monitoramento; relatórios de inspeção; processos instruídos, termos de compromisso e penalidades.",
    "stakeholders": "Supervisão de Mercados; Credenciamento; Jurídico; Plataforma de Operações (dados); Conselhos de Autorregulação e Ética. Destinos: instituições participantes, CVM, investidores e mercado.",
    "responsible": "Jurídico, Representação de Mercados, Credenciamento, Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 71,
    "policies": [
      {
        "id": "anb-l1-r2e-pol-1",
        "name": "Códigos ANBIMA de Autorregulação (Administração e Gestão de Recursos de Terceiros, Distribuição, Ofertas Públicas etc.)",
        "type": "Referência de Mercado",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-r2e-pol-2",
        "name": "Convênio CVM-ANBIMA",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-r2e-pol-3",
        "name": "Resolução CVM 175",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-r2e-pol-4",
        "name": "Regras de procedimentos de supervisão e processos",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Prazo médio de análise de adesão",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de instituições supervisionadas por nível de risco",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Nº de inspeções realizadas vs. plano",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Tempo médio de instrução de processos",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de penalidades cumpridas",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "SSM",
      "Neoway",
      "Cognito",
      "Databricks",
      "Portal ANBIMA",
      "Open Metadata",
      "AWS",
      "Nexxus",
      "RDS ANBIMA",
      "Dataiku",
      "Power BI",
      "Máquina Virtual",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: SSM como sistema de caso (admissão, supervisão, processos)",
      "TO-BE: Databricks/Dataiku/Power BI para analytics de supervisão",
      "TO-BE: Neoway para due diligence",
      "TO-BE: Cognito para formulários",
      "TO-BE: módulo de inspeções (novo — pode ser extensão do SSM) para planejamento",
      "TO-BE: evidências e planos de ação"
    ],
    "painPoints": [
      "Ausência de inspeção estruturada (lacuna IOSCO)",
      "Planejamento de supervisão baseada em risco não mapeado",
      "Dependência de dados de qualidade enviados pelos participantes",
      "Prazos regulatórios rígidos (convênio CVM)",
      "Escritório externo crítico na admissão"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-r2e-1",
        "name": "Elaborar e Manter Autorregulação",
        "code": "R2E.1",
        "description": "Elaborar, revisar e publicar códigos e regras de autorregulação.",
        "objective": "Elaborar, revisar e publicar códigos e regras de autorregulação.",
        "valueProposition": "Regras atualizadas e aderentes ao mercado e à regulação.",
        "scopeBoundary": "Compreende os L3: R2E.1.1 Desenvolver Códigos e Regras. Insere-se no L1 R2E e se limita às atividades descritas nesses L3.",
        "inputs": "Arquivo em word; Arquivo final do guia; título; descrição; temas de classificação; formato do arquivo;… Fornecedores: Área interna.",
        "outputs": "Minuta dos códigos alterados; Guia publicado ou atualizado na página de guias da Anbima, organizado em card e…",
        "stakeholders": "Áreas executoras: Jurídico, Representação de Mercados. Destinos: Áreas internas; Mercado em geral.",
        "responsible": "Jurídico, Representação de Mercados",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-r2e-1-pol-1",
            "name": "7 dias úteis para análise",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Tempo de ciclo de revisão de código",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Nº consultas públicas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Microsoft Excel",
          "Microsoft Outlook",
          "Microsoft SharePoint",
          "Microsoft Word",
          "Portal ANBIMA"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 2 macroprocesso(s) (OP-093, OP-212)",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Dependência de terceiros: Lumis, indispensável para a administração e publicação dos conteúdos no website da ANBIMA"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2e-1-1",
            "name": "Desenvolver Códigos e Regras",
            "code": "R2E.1.1",
            "description": "Elabora, revisa e publica códigos de autorregulação e melhores práticas.",
            "objective": "Elabora, revisa e publica códigos de autorregulação e melhores práticas.",
            "valueProposition": "Atualizar os códigos de autorregulação e documentos relacionados, incorporando as… / Disponibilizar ao mercado os guias técnicos e de melhores práticas produzidos ou…",
            "scopeBoundary": "Atividades L4: Identificar necessidade de nova regra ou revisão ; Elaborar e revisar códigos de autorregulação; Submeter regras a audiência com associados ; Publicar guias técnicos e de melhores práticas. Macroprocessos AS-IS: OP-093, OP-212.",
            "inputs": "Arquivo em word; Arquivo final do guia; título; descrição; temas de classificação; formato do arquivo;… Fornecedores: Área interna.",
            "outputs": "Minuta dos códigos alterados; Guia publicado ou atualizado na página de guias da Anbima, organizado em card e…",
            "stakeholders": "Áreas executoras: Jurídico, Representação de Mercados. Destinos: Áreas internas; Mercado em geral.",
            "responsible": "Jurídico, Representação de Mercados",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2e-1-1-pol-1",
                "name": "7 dias úteis para análise",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Microsoft Word",
              "Portal ANBIMA"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-093, OP-212)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Dependência de terceiros: Lumis, indispensável para a administração e publicação dos conteúdos no website da ANBIMA"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-093, OP-212"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-1-1-1",
                "name": "Identificar necessidade de nova regra ou revisão",
                "code": "R2E.1.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.1.1 Desenvolver Códigos e Regras.",
                "responsible": "Jurídico, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-1-1-2",
                "name": "Elaborar e revisar códigos de autorregulação",
                "code": "R2E.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-093, OP-212).",
                "scopeBoundary": "Atividade do L3 R2E.1.1 Desenvolver Códigos e Regras.",
                "responsible": "Jurídico, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-1-1-3",
                "name": "Submeter regras a audiência com associados",
                "code": "R2E.1.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.1.1 Desenvolver Códigos e Regras.",
                "responsible": "Jurídico, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-1-1-4",
                "name": "Publicar guias técnicos e de melhores práticas",
                "code": "R2E.1.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-093, OP-212).",
                "scopeBoundary": "Atividade do L3 R2E.1.1 Desenvolver Códigos e Regras.",
                "responsible": "Jurídico, Representação de Mercados",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2e-2",
        "name": "Admitir e Credenciar Participantes",
        "code": "R2E.2",
        "description": "Admitir, manter e habilitar instituições e participantes.",
        "objective": "Admitir, manter e habilitar instituições e participantes.",
        "valueProposition": "Entrada no mercado apenas de participantes que atendam padrões mínimos.",
        "scopeBoundary": "Compreende os L3: R2E.2.1 Admitir Instituições; R2E.2.2 Habilitar Participantes (Convênio CVM). Insere-se no L1 R2E e se limita às atividades descritas nesses L3.",
        "inputs": "Documentos, Declarações, Formulários padrão, Políticas; Documentos, Políticas. Fornecedores: As informações são fornecidas pelas próprias pessoas jurídicas requerente, além de…; As informaçoes são obtidas de bases internas e consulta pública de informações…; As informações são fornecidas pela Supervisão de Mercados, depois tratadas a partir da…; As informações são fornecidas pelas próprias pessoas físicas requerente, além de…",
        "outputs": "Relatório; Ação sistêmica de troca de selo.",
        "stakeholders": "Áreas executoras: Credenciamento. Destinos: Associados; Reguladores; Quem recebe a informação é o Conselho de Ética.",
        "responsible": "Credenciamento",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-r2e-2-pol-1",
            "name": "Sim, há um prazo definido em regra da ANBIMA a partir do qual a instituição está…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-2-pol-2",
            "name": "Sim, há um prazo definido em regra da ANBIMA a partir do qual a instituição está…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-2-pol-3",
            "name": "Sim, prazo firmado no Convênio CVM-ANBIMA, na própria regulação. 60 dias corridos…",
            "type": "Norma Regulatória",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Prazo médio de análise",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% dentro do prazo do convênio CVM",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 3, Muito Crítico: 3",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Microsoft Excel",
          "Microsoft PowerPoint",
          "Microsoft Word",
          "SSM",
          "Microsoft SharePoint",
          "Neoway",
          "Open Metadata",
          "Cognito"
        ],
        "painPoints": [
          "3 de 6 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-084, OP-085, OP-086, OP-082, OP-083)",
          "Dependência de pessoa-chave em OP-087, OP-086",
          "Procedimento não documentado ou só informal em OP-087"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2e-2-1",
            "name": "Admitir Instituições",
            "code": "R2E.2.1",
            "description": "Gerencia entrada, manutenção cadastral, selos e saída de instituições.",
            "objective": "Gerencia entrada, manutenção cadastral, selos e saída de instituições.",
            "valueProposition": "Garantir padrões mínimos éticos e técnicos para as instituições que desejam se… / Manutenção do adequado cadastro das instituições na ANBIMA identificando e tratando… / Garantir o cumprimento de regra de autorregulação.",
            "scopeBoundary": "Atividades L4: Processar adesão e filiação; Processar alteração cadastral; Gerir troca de selo; Processar cancelamento. Macroprocessos AS-IS: OP-084, OP-085, OP-087, OP-086.",
            "inputs": "Documentos, Declarações, Formulários padrão, Políticas; Documentos, Políticas. Fornecedores: As informações são fornecidas pelas próprias pessoas jurídicas requerente, além de…; As informaçoes são obtidas de bases internas e consulta pública de informações…; As informações são fornecidas pela Supervisão de Mercados, depois tratadas a partir da…",
            "outputs": "Relatório; Ação sistêmica de troca de selo.",
            "stakeholders": "Áreas executoras: Credenciamento. Destinos: Associados; Quem recebe a informação é o Conselho de Ética.",
            "responsible": "Credenciamento",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2e-2-1-pol-1",
                "name": "Sim, há um prazo definido em regra da ANBIMA a partir do qual a instituição está…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-2-1-pol-2",
                "name": "Sim, há um prazo definido em regra da ANBIMA a partir do qual a instituição está…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 3, Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft Word",
              "SSM",
              "Microsoft SharePoint",
              "Neoway",
              "Open Metadata"
            ],
            "painPoints": [
              "1 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-084, OP-085, OP-086)",
              "Dependência de pessoa-chave em OP-087, OP-086",
              "Procedimento não documentado ou só informal em OP-087",
              "Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Não há",
              "Dependência de terceiros: Target Law - escritório jurídico"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-084, OP-085, OP-087, OP-086"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-2-1-1",
                "name": "Processar adesão e filiação",
                "code": "R2E.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                "scopeBoundary": "Atividade do L3 R2E.2.1 Admitir Instituições.",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-2-1-2",
                "name": "Processar alteração cadastral",
                "code": "R2E.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                "scopeBoundary": "Atividade do L3 R2E.2.1 Admitir Instituições.",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-2-1-3",
                "name": "Gerir troca de selo",
                "code": "R2E.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                "scopeBoundary": "Atividade do L3 R2E.2.1 Admitir Instituições.",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-2-1-4",
                "name": "Processar cancelamento",
                "code": "R2E.2.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                "scopeBoundary": "Atividade do L3 R2E.2.1 Admitir Instituições.",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-r2e-2-2",
            "name": "Habilitar Participantes (Convênio CVM)",
            "code": "R2E.2.2",
            "description": "Habilita pessoas físicas e jurídicas no âmbito do convênio CVM-ANBIMA.",
            "objective": "Habilita pessoas físicas e jurídicas no âmbito do convênio CVM-ANBIMA.",
            "valueProposition": "Atender ao Convênio CVM-ANBIMA provendo análise técnica ao regulador.",
            "scopeBoundary": "Atividades L4: Habilitar pessoa física; Habilitar pessoa jurídica. Macroprocessos AS-IS: OP-082, OP-083.",
            "inputs": "Documentos, Declarações, Formulários padrão; Documentos, Declarações, Formulários padrão, Políticas. Fornecedores: As informações são fornecidas pelas próprias pessoas físicas requerente, além de…; As informações são fornecidas pelas próprias pessoas jurídicas requerente, além de…",
            "outputs": "Relatório.",
            "stakeholders": "Áreas executoras: Credenciamento. Destinos: Reguladores.",
            "responsible": "Credenciamento",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2e-2-2-pol-1",
                "name": "Sim, prazo firmado no Convênio CVM-ANBIMA, na própria regulação. 60 dias corridos…",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft SharePoint",
              "Microsoft Word",
              "Neoway",
              "SSM"
            ],
            "painPoints": [
              "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-082, OP-083)",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Autorização compulsória de um requerente",
              "Dependência de terceiros: Target Law - escritório jurídico"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-082, OP-083"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-2-2-1",
                "name": "Habilitar pessoa física",
                "code": "R2E.2.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-082, OP-083).",
                "scopeBoundary": "Atividade do L3 R2E.2.2 Habilitar Participantes (Convênio CVM).",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-2-2-2",
                "name": "Habilitar pessoa jurídica",
                "code": "R2E.2.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-082, OP-083).",
                "scopeBoundary": "Atividade do L3 R2E.2.2 Habilitar Participantes (Convênio CVM).",
                "responsible": "Credenciamento",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2e-3",
        "name": "Supervisionar Mercado",
        "code": "R2E.3",
        "description": "Supervisionar o mercado com base em risco, monitorar participantes e aplicar sanções.",
        "objective": "Supervisionar o mercado com base em risco, monitorar participantes e aplicar sanções.",
        "valueProposition": "Detecção tempestiva de desvios e enforcement crível.",
        "scopeBoundary": "Compreende os L3: R2E.3.1 Planejar Supervisão Baseada em Risco; R2E.3.2 Monitorar Participantes e Produtos; R2E.3.3 Conduzir Processos e Aplicar Sanções. Insere-se no L1 R2E e se limita às atividades descritas nesses L3.",
        "inputs": "Base de Fundos, Carteiras CDA, Ofertas Públicas, Base REUNE, SSM, Receita, Bacen, CVM…; Carteiras de Fundos Financeiros. Fornecedores: Reguladores (BCB/CVM); Área interna; Instituições participantes; Área interna e instituições participantes.",
        "outputs": "Informações coletadas, dados tratados e visualizações/relatórios para suporte à Supervisão; Resultados de Desenquadramento + Saídas em Analytics.",
        "stakeholders": "Áreas executoras: Supervisão de Mercados, Plataforma de operações, Jurídico, Business Analytics, Fundos. Destinos: Áreas internas; Mercado em geral; Associados.",
        "responsible": "Supervisão de Mercados, Plataforma de operações, Jurídico, Business Analytics, Fundos",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 67,
        "policies": [
          {
            "id": "anb-l2-r2e-3-pol-1",
            "name": "12º dia útil a CVM precisa nos encaminhar o CDA, quanto ao processo de ingestão +…",
            "type": "Norma Regulatória",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-3-pol-2",
            "name": "Sim - Código de Administração e Gestão de Recursos de Terceiros",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-3-pol-3",
            "name": "7 dias úteis para análise",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% alertas tratados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Tempo de instrução de processos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4, Moderado: 2, Muito Crítico: 1, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Databricks",
          "Cognito",
          "SSM",
          "AWS",
          "Nexxus",
          "RDS ANBIMA",
          "Dataiku",
          "Power BI"
        ],
        "painPoints": [
          "2 de 8 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-217, OP-218, OP-130, OP-092, OP-131)",
          "Procedimento não documentado ou só informal em OP-216, OP-220, OP-221",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2e-3-1",
            "name": "Planejar Supervisão Baseada em Risco",
            "code": "R2E.3.1",
            "description": "Define prioridades e plano anual de supervisão.",
            "objective": "Define prioridades e plano anual de supervisão.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 R2E.3 Supervisionar Mercado.",
            "scopeBoundary": "Atividades L4 propostas: Elaborar plano de supervisão baseada em risco.",
            "inputs": "Diretrizes estratégicas e normativas do L1 R2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 R2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-r2e-3-1-pol-1",
                "name": "Regras de supervisão baseada em risco ANBIMA",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-3-1-pol-2",
                "name": "Convênio CVM-ANBIMA",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "SSM (sugerido)",
              "Databricks/Power BI (matriz de risco) (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-3-1-1",
                "name": "Elaborar plano de supervisão baseada em risco",
                "code": "R2E.3.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.3.1 Planejar Supervisão Baseada em Risco.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-r2e-3-2",
            "name": "Monitorar Participantes e Produtos",
            "code": "R2E.3.2",
            "description": "Monitora dados, enquadramento e eventos com apoio de analytics.",
            "objective": "Monitora dados, enquadramento e eventos com apoio de analytics.",
            "valueProposition": "Coletar, tratar, disponibilizar e visualizar dados para subsidiar as atividades e a… / Atender o convênio entre ANBIMA e CVM, anexo de enqudramento / Consumir todas as informações necessárias que estão sob governança do TI (bases…",
            "scopeBoundary": "Atividades L4: Desenvolver e suportar analytics de supervisão; Processar enquadramento de fundos; Consumir e tratar bases internas para supervisão; Automatizar rotinas de supervisão (RPA); Monitorar eventos episódicos e exposição do mercado; Cobrar qualidade das informações enviadas. Macroprocessos AS-IS: OP-216, OP-217, OP-218, OP-220, OP-221, OP-130.",
            "inputs": "Base de Fundos, Carteiras CDA, Ofertas Públicas, Base REUNE, SSM, Receita, Bacen, CVM…; Carteiras de Fundos Financeiros. Fornecedores: Reguladores (BCB/CVM); Área interna; Instituições participantes; Área interna e instituições participantes.",
            "outputs": "Informações coletadas, dados tratados e visualizações/relatórios para suporte à Supervisão; Resultados de Desenquadramento + Saídas em Analytics.",
            "stakeholders": "Áreas executoras: Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos. Destinos: Áreas internas; Mercado em geral.",
            "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2e-3-2-pol-1",
                "name": "12º dia útil a CVM precisa nos encaminhar o CDA, quanto ao processo de ingestão +…",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-3-2-pol-2",
                "name": "Sim - Código de Administração e Gestão de Recursos de Terceiros",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Mensal, Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4, Moderado: 1, Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Databricks",
              "Cognito",
              "AWS",
              "Nexxus",
              "RDS ANBIMA",
              "Dataiku",
              "Power BI"
            ],
            "painPoints": [
              "1 de 6 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-217, OP-218, OP-130)",
              "Procedimento não documentado ou só informal em OP-216, OP-220, OP-221",
              "Dependência de terceiros: Nexxus, AWS",
              "Databricks"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-216, OP-217, OP-218, OP-220, OP-221, OP-130"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-3-2-1",
                "name": "Desenvolver e suportar analytics de supervisão",
                "code": "R2E.3.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-2-2",
                "name": "Processar enquadramento de fundos",
                "code": "R2E.3.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-2-3",
                "name": "Consumir e tratar bases internas para supervisão",
                "code": "R2E.3.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-2-4",
                "name": "Automatizar rotinas de supervisão (RPA)",
                "code": "R2E.3.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-2-5",
                "name": "Monitorar eventos episódicos e exposição do mercado",
                "code": "R2E.3.2.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-2-6",
                "name": "Cobrar qualidade das informações enviadas",
                "code": "R2E.3.2.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                "scopeBoundary": "Atividade do L3 R2E.3.2 Monitorar Participantes e Produtos.",
                "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-r2e-3-3",
            "name": "Conduzir Processos e Aplicar Sanções",
            "code": "R2E.3.3",
            "description": "Instrui processos, aplica penalidades e acompanha seu cumprimento.",
            "objective": "Instrui processos, aplica penalidades e acompanha seu cumprimento.",
            "valueProposition": "Avaliar os processos de autorregulação, identificando oportunidades de melhoria e… / Apuração de multas conforme previsto no código de Administração e Gestão de Recursos…",
            "scopeBoundary": "Atividades L4: Revisar processos de autorregulação; Instaurar processos e celebrar termos de compromisso ; Aplicar multas e penalidades. Macroprocessos AS-IS: OP-092, OP-131.",
            "inputs": "Arquivo em word; Planilhas geradas em processos automatizados, envio através do SSM e Planilhas de… Fornecedores: Área interna; Instituições participantes.",
            "outputs": "Relatório de PAI e Processos; Cumprimento autorregulatório.",
            "stakeholders": "Áreas executoras: Jurídico, Plataforma de operações, Fundos. Destinos: Áreas internas; Associados.",
            "responsible": "Jurídico, Plataforma de operações, Fundos",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2e-3-3-pol-1",
                "name": "7 dias úteis para análise",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-3-3-pol-2",
                "name": "Sim - Código de Administração e Gestão de Recursos de Terceiros",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Microsoft Word",
              "Databricks",
              "SSM"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-092, OP-131)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-092, OP-131"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-3-3-1",
                "name": "Revisar processos de autorregulação",
                "code": "R2E.3.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-092, OP-131).",
                "scopeBoundary": "Atividade do L3 R2E.3.3 Conduzir Processos e Aplicar Sanções.",
                "responsible": "Jurídico, Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-3-2",
                "name": "Instaurar processos e celebrar termos de compromisso",
                "code": "R2E.3.3.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.3.3 Conduzir Processos e Aplicar Sanções.",
                "responsible": "Jurídico, Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-3-3-3",
                "name": "Aplicar multas e penalidades",
                "code": "R2E.3.3.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-092, OP-131).",
                "scopeBoundary": "Atividade do L3 R2E.3.3 Conduzir Processos e Aplicar Sanções.",
                "responsible": "Jurídico, Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2e-4",
        "name": "Inspecionar o Mercado",
        "code": "R2E.4",
        "description": "Inspecionar instituições participantes de forma periódica e temática (novo L2).",
        "objective": "Inspecionar instituições participantes de forma periódica e temática (novo L2).",
        "valueProposition": "Verificação direta de aderência, alinhada às recomendações IOSCO.",
        "scopeBoundary": "Compreende os L3: R2E.4.1 Conduzir Inspeções. Insere-se no L1 R2E e se limita às atividades descritas nesses L3.",
        "inputs": "Diretrizes do L1 R2E; ver detalhamento nos L3.",
        "outputs": "Planeja e executa inspeções periódicas e temáticas (in loco e remotas) nas instituições participantes, verificando a aderência aos códigos e regras de autorregulação.",
        "stakeholders": "Área responsável a definir (sem macroprocesso AS-IS).",
        "responsible": "A definir",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "pending",
        "contextValidationPercent": 0,
        "policies": [
          {
            "id": "anb-l2-r2e-4-pol-1",
            "name": "Recomendações IOSCO para SROs",
            "type": "Norma Regulatória",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-4-pol-2",
            "name": "Códigos ANBIMA",
            "type": "Autorregulação ANBIMA",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2e-4-pol-3",
            "name": "regras de procedimentos de supervisão",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Inspeções realizadas vs. plano",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% planos de ação concluídos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          }
        ],
        "systems": [
          "SSM (extensão para inspeções) ou módulo dedicado (sugerido)",
          "SharePoint para evidências (sugerido)",
          "Power BI (sugerido)"
        ],
        "painPoints": [
          "L2 sem macroprocesso AS-IS — capacidade inexistente ou informal hoje",
          "Requer definição de dono, processo e ferramenta"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2e-4-1",
            "name": "Conduzir Inspeções",
            "code": "R2E.4.1",
            "description": "Planeja e executa inspeções periódicas e temáticas (in loco e remotas) nas instituições participantes, verificando a aderência aos códigos e regras de autorregulação.",
            "objective": "Planeja e executa inspeções periódicas e temáticas (in loco e remotas) nas instituições participantes, verificando a aderência aos códigos e regras de autorregulação.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 R2E.4 Inspecionar o Mercado.",
            "scopeBoundary": "Atividades L4 propostas: Planejar ciclo de inspeções periódicas e temáticas ; Executar inspeções in loco e remotas ; Emitir relatório de inspeção e acompanhar planos de ação.",
            "inputs": "Diretrizes estratégicas e normativas do L1 R2E; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 R2E.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-r2e-4-1-pol-1",
                "name": "Recomendações IOSCO para SROs",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-4-1-pol-2",
                "name": "Códigos ANBIMA",
                "type": "Autorregulação ANBIMA",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2e-4-1-pol-3",
                "name": "regras de procedimentos de supervisão",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "SSM (extensão para inspeções) ou módulo dedicado (sugerido)",
              "SharePoint para evidências (sugerido)",
              "Power BI (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-r2e-4-1-1",
                "name": "Planejar ciclo de inspeções periódicas e temáticas",
                "code": "R2E.4.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.4.1 Conduzir Inspeções.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-4-1-2",
                "name": "Executar inspeções in loco e remotas",
                "code": "R2E.4.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.4.1 Conduzir Inspeções.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2e-4-1-3",
                "name": "Emitir relatório de inspeção e acompanhar planos de ação",
                "code": "R2E.4.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2E.4.1 Conduzir Inspeções.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-c2p",
    "name": "Coleta a Publicação",
    "code": "C2P",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Coletar e validar dados de mercado e transformá-los em preços, curvas, índices, estatísticas, rankings e produtos de dados de referência, distribuídos com qualidade e pontualidade ao mercado.",
    "objective": "Coletar e validar dados de mercado e transformá-los em preços, curvas, índices, estatísticas, rankings e produtos de dados de referência, distribuídos com qualidade e pontualidade ao mercado.",
    "valueProposition": "Ser a fonte de referência confiável e independente para marcação a mercado, benchmarks e informação da indústria, sustentando decisões de investimento, precificação e regulação.",
    "scopeBoundary": "Inclui coleta e depuração de dados de fundos, carteiras, mercado de capitais e distribuição; precificação de títulos públicos e privados; curvas; cálculo e governança de índices (IOSCO); rankings, boletins e projeções; desenvolvimento, distribuição e suporte de produtos de dados (ANBIMA Data, Feed, Galgo). A plataforma tecnológica subjacente está em TEC.",
    "inputs": "Arquivos de instituições participantes e informantes de preços; dados B3, Selic/BCB, Tesouro, IBGE/FGV; contratos de licenciamento; metodologias aprovadas; demandas de consumidores de dados.",
    "outputs": "Preços e taxas diários (até 9h/12h30); curvas de juros; índices IMA, IDA, IHFA e carteiras teóricas; rankings e boletins; bases distribuídas via ANBIMA Data/Feed/Hub; atendimento a usuários de dados.",
    "stakeholders": "Plataforma de Operações (Preços, Índices e Modelagens; Informações Técnicas); Tecnologia/Dados; Representação (boletins). Destinos: mercado em geral, administradores e gestores de fundos, licenciadores, imprensa, reguladores.",
    "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição, Preços, Índices e Modelagens, Representação de Mercados, Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 93,
    "policies": [
      {
        "id": "anb-l1-c2p-pol-1",
        "name": "Princípios IOSCO para Benchmarks Financeiros",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-c2p-pol-2",
        "name": "Código ANBIMA de Administração e Gestão de Recursos de Terceiros",
        "type": "Referência de Mercado",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-c2p-pol-3",
        "name": "contratos de licenciamento e divulgação (ANBIMA Feed)",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-c2p-pol-4",
        "name": "metodologias públicas de índices e precificação",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "% de publicações no horário (SLA 9h/12h30)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Nº de republicações/erros",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Disponibilidade dos canais (Feed/Data)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% de dados recebidos no prazo",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Receita de licenciamento de dados",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Rundeck",
      "Databricks",
      "ARC",
      "NAI",
      "ANBIMA Data",
      "Hub ANBIMA",
      "ANBIMA Input",
      "Sistema interno - SUP privados",
      "ANBIMA Feed",
      "Python",
      "Fundos",
      "Power BI",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Databricks (lakehouse) como plataforma única de dados",
      "TO-BE: Dataiku para depurações",
      "TO-BE: NAI/SUP/ARC (Accenture) para cálculo de preços",
      "TO-BE: MATLAB para curvas",
      "TO-BE: Rundeck para orquestração",
      "TO-BE: ANBIMA Data/Feed/Hub (RTM/Galgo) para distribuição",
      "TO-BE: OpenMetadata para catálogo"
    ],
    "painPoints": [
      "Concentração de macroprocessos 'Muito Crítico' com prazos diários rígidos",
      "Dependência de terceiros (Accenture, B3, RTM, provedores de preços)",
      "Uso intenso de Excel em cálculos críticos",
      "Governança de metodologias não formalizada (lacuna IOSCO)",
      "Risco reputacional em caso de erro de publicação"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-c2p-1",
        "name": "Coletar e Validar Dados de Mercado",
        "code": "C2P.1",
        "description": "Coletar e validar dados de fundos, carteiras, mercado de capitais e distribuição.",
        "objective": "Coletar e validar dados de fundos, carteiras, mercado de capitais e distribuição.",
        "valueProposition": "Bases íntegras que alimentam preços, índices, estatísticas e supervisão.",
        "scopeBoundary": "Compreende os L3: C2P.1.1 Coletar Informações de Fundos e Carteiras; C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição. Insere-se no L1 C2P e se limita às atividades descritas nesses L3.",
        "inputs": "Informações disponibiizadas diretamente através do HUB Anbima para base transacional…; Informações disponibilizadas no metabase (transacional) e databricks (analítica). Fornecedores: Instituições participantes; B3.",
        "outputs": "Disponibilidade de informações de pl/cota dos fundos de investimento; Disponibilidade de informações de fundos e carteiras administradas.",
        "stakeholders": "Áreas executoras: Plataforma de operações, Fundos, Mercados de Capitais e Distribuição. Destinos: Mercado em geral; Áreas internas.",
        "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-c2p-1-pol-1",
            "name": "Sim - Contratos de Divulgação ANBIMA Feed Sim - Código de Administração e Gestão de…",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-1-pol-2",
            "name": "Sim - Código de Administração e Gestão de Recursos de Terceiros",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-1-pol-3",
            "name": "Sim, informação deve ser divulgada diariamente",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% arquivos recebidos no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Taxa de inconsistências",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Muito Crítico: 5, Crítico: 3, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ANBIMA Input",
          "ANBIMA Data",
          "Hub ANBIMA",
          "Databricks",
          "Dataiku",
          "Open Metadata",
          "SSM",
          "ARC"
        ],
        "painPoints": [
          "8 de 9 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 8 macroprocesso(s) (OP-139, OP-140, OP-129, OP-143, OP-142, OP-144, OP-146, OP-147)",
          "Impactos/penalidades declarados: Multa para a instituição, conforme descrito em código",
          "Dependência de terceiros: RTM - Desenvolvedora do HUB ANBIMA",
          "Dataiku e Databricks: execução das depurações",
          "Neoway: preenchimento automático de…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-c2p-1-1",
            "name": "Coletar Informações de Fundos e Carteiras",
            "code": "C2P.1.1",
            "description": "Recebe, depura e valida informações periódicas de fundos e carteiras administradas.",
            "objective": "Recebe, depura e valida informações periódicas de fundos e carteiras administradas.",
            "valueProposition": "Coleta das informações periódicas de fundos de investimento / Coleta das informações periódicas de fundos de investimento e carteiras administradas / Análise de possíveis inconsistências e de cenários de exceção no envio.",
            "scopeBoundary": "Atividades L4: Receber informações periódicas de fundos (PL/cota); Receber informações periódicas via ANBIMA Input; Executar rotinas do Hub ANBIMA; Depurar carteiras administradas, IE e FIP. Macroprocessos AS-IS: OP-139, OP-140, OP-129, OP-135.",
            "inputs": "Informações disponibiizadas diretamente através do HUB Anbima para base transacional…; Informações disponibilizadas no metabase (transacional) e databricks (analítica). Fornecedores: Instituições participantes.",
            "outputs": "Disponibilidade de informações de pl/cota dos fundos de investimento; Disponibilidade de informações de fundos e carteiras administradas.",
            "stakeholders": "Áreas executoras: Plataforma de operações, Fundos. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Fundos",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-1-1-pol-1",
                "name": "Sim - Contratos de Divulgação ANBIMA Feed Sim - Código de Administração e Gestão de…",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-c2p-1-1-pol-2",
                "name": "Sim - Código de Administração e Gestão de Recursos de Terceiros",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2, Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Hub ANBIMA",
              "ANBIMA Input",
              "Databricks",
              "Dataiku",
              "Open Metadata",
              "SSM"
            ],
            "painPoints": [
              "4 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-139, OP-140, OP-129)",
              "Impactos/penalidades declarados: Multa para a instituição, conforme descrito em código",
              "Dependência de terceiros: RTM - Desenvolvedora do HUB ANBIMA",
              "Dataiku e Databricks: execução das depurações",
              "Neoway: preenchimento automático de…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-139, OP-140, OP-129, OP-135"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-1-1-1",
                "name": "Receber informações periódicas de fundos (PL/cota)",
                "code": "C2P.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                "scopeBoundary": "Atividade do L3 C2P.1.1 Coletar Informações de Fundos e Carteiras.",
                "responsible": "Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-1-2",
                "name": "Receber informações periódicas via ANBIMA Input",
                "code": "C2P.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                "scopeBoundary": "Atividade do L3 C2P.1.1 Coletar Informações de Fundos e Carteiras.",
                "responsible": "Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-1-3",
                "name": "Executar rotinas do Hub ANBIMA",
                "code": "C2P.1.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                "scopeBoundary": "Atividade do L3 C2P.1.1 Coletar Informações de Fundos e Carteiras.",
                "responsible": "Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-1-4",
                "name": "Depurar carteiras administradas, IE e FIP",
                "code": "C2P.1.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                "scopeBoundary": "Atividade do L3 C2P.1.1 Coletar Informações de Fundos e Carteiras.",
                "responsible": "Plataforma de operações, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-1-2",
            "name": "Coletar Dados de Mercado de Capitais e Distribuição",
            "code": "C2P.1.2",
            "description": "Credencia e valida bases de mercado de capitais e distribuição.",
            "objective": "Credencia e valida bases de mercado de capitais e distribuição.",
            "valueProposition": "Validar os dados de debêntures enviados pela B3 com os documentos dos títulos / Verificar se há algum problema nas públicações da prévia do REUNE, como interrupção da… / Confrontar valores mensais enviados pelos aderentes ao código e questionar os…",
            "scopeBoundary": "Atividades L4: Credenciar base de secundário de debêntures; Monitorar prévia do REUNE; Depurar dados de distribuição (Private, Varejo, Gestão de Patrimônio); Coletar documentos para preços e índices; Validar debentures.com.br. Macroprocessos AS-IS: OP-143, OP-142, OP-144, OP-146, OP-147.",
            "inputs": "Arquivos Txt da B3; Documentos enviados pelo fiduciário ou coletado na B3; ANBIMA Input. Fornecedores: B3; Instituições participantes.",
            "outputs": "Cadastro e características atualizadas de debêntures no ANBIMA Data, documentos…; Prévia do REUNE; Painel de preços; Dataset de negociaçoes de títulos privados.",
            "stakeholders": "Áreas executoras: Plataforma de operações, Mercados de Capitais e Distribuição. Destinos: Mercado em geral; Áreas internas.",
            "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-1-2-pol-1",
                "name": "Sim, informação deve ser divulgada diariamente",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 3, Crítico: 1, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Data",
              "ANBIMA Input",
              "ARC",
              "Sistema de distribuição (Envio de dados)",
              "RPA",
              "Debêntures"
            ],
            "painPoints": [
              "4 de 5 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 5 macroprocesso(s) (OP-143, OP-142, OP-144, OP-146, OP-147)",
              "Dependência de terceiros: B3",
              "Accenture",
              "B3, representa 99% dos dados enviados"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-143, OP-142, OP-144, OP-146, OP-147"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-1-2-1",
                "name": "Credenciar base de secundário de debêntures",
                "code": "C2P.1.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                "scopeBoundary": "Atividade do L3 C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição.",
                "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-2-2",
                "name": "Monitorar prévia do REUNE",
                "code": "C2P.1.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                "scopeBoundary": "Atividade do L3 C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição.",
                "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-2-3",
                "name": "Depurar dados de distribuição (Private, Varejo, Gestão de Patrimônio)",
                "code": "C2P.1.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                "scopeBoundary": "Atividade do L3 C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição.",
                "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-2-4",
                "name": "Coletar documentos para preços e índices",
                "code": "C2P.1.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                "scopeBoundary": "Atividade do L3 C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição.",
                "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-1-2-5",
                "name": "Validar debentures.com.br",
                "code": "C2P.1.2.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                "scopeBoundary": "Atividade do L3 C2P.1.2 Coletar Dados de Mercado de Capitais e Distribuição.",
                "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-c2p-2",
        "name": "Precificar Ativos e Calcular Curvas",
        "code": "C2P.2",
        "description": "Precificar títulos públicos e privados, calcular curvas e gerir insumos de precificação.",
        "objective": "Precificar títulos públicos e privados, calcular curvas e gerir insumos de precificação.",
        "valueProposition": "Referência independente de marcação a mercado para toda a indústria.",
        "scopeBoundary": "Compreende os L3: C2P.2.1 Precificar Títulos Públicos; C2P.2.2 Precificar Títulos Privados; C2P.2.3 Calcular Curvas de Referência; C2P.2.4 Gerir Insumos e Ferramentas de Precificação. Insere-se no L1 C2P e se limita às atividades descritas nesses L3.",
        "inputs": "Arquivos de preços das instituições informantes e ofertas das corretoras; planilhas de…; Projeções das variações dos índices mensais de inflação. Fornecedores: Instituições participantes; Reguladores (BCB/CVM); Fornecedor/prestador externo; Área interna.",
        "outputs": "Preços publicados nos canais de divulgação (portal, portal associados, feed, data),…; Preços publicados nos canais de divulgação (feed, data), arquivos em excel com as…",
        "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
        "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-c2p-2-pol-1",
            "name": "Contrato de licenciamento dos preços / não há prazo definido no contrato, mas o prazo…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-2-pol-2",
            "name": "Entrega nos canais de divulgação até às 12:30hs, diariamente",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-2-pol-3",
            "name": "Entrega nos canais de divulgação até às 9:00hs, diariamente",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-2-pol-4",
            "name": "Após a divulgação dos preços de referência das debêntures",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% publicações no horário",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Nº republicações",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Muito Crítico: 10, Crítico: 3, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ARC",
          "NAI",
          "Microsoft Excel",
          "Sistema interno - SUP privados",
          "Sistema call corretores",
          "Rundeck",
          "Sistema interno - SUP públicos",
          "FTP SELIC/BCB"
        ],
        "painPoints": [
          "13 de 14 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 11 macroprocesso(s) (OP-151, OP-156, OP-150, OP-152, OP-153, OP-154, OP-155, OP-161, OP-158, OP-177, OP-157)",
          "Procedimento não documentado ou só informal em OP-159, OP-178",
          "Uso de Excel em etapas operacionais (5 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-c2p-2-1",
            "name": "Precificar Títulos Públicos",
            "code": "C2P.2.1",
            "description": "Calcula e divulga taxas, preços e referências de títulos públicos.",
            "objective": "Calcula e divulga taxas, preços e referências de títulos públicos.",
            "valueProposition": "Calcular e publicar diariamente os preços de referência a ser utilizados pelo mercado / Calcular e publicar diariamente as taxas de compra e venda praticadas pelo mercado no… / Disponibilizar ao mercado os valores nominais atualziados diariamente, para…",
            "scopeBoundary": "Atividades L4: Calcular e divulgar preços de títulos públicos; Divulgar prévia ANBIMA 12h; Calcular VNA de títulos públicos; Divulgar PU 550/238. Macroprocessos AS-IS: OP-151, OP-156, OP-159, OP-178.",
            "inputs": "Arquivos de preços das instituições informantes e ofertas das corretoras; planilhas de…; Projeções das variações dos índices mensais de inflação. Fornecedores: Instituições participantes; Reguladores (BCB/CVM).",
            "outputs": "Preços publicados nos canais de divulgação (portal, portal associados, feed, data),…; Preços publicados nos canais de divulgação (feed, data), arquivos em excel com as…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-2-1-pol-1",
                "name": "Contrato de licenciamento dos preços / não há prazo definido no contrato, mas o prazo…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-c2p-2-1-pol-2",
                "name": "Entrega nos canais de divulgação até às 12:30hs, diariamente",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 3, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "NAI",
              "Microsoft Excel",
              "Sistema call corretores",
              "Sistema interno - SUP públicos",
              "FTP SELIC/BCB",
              "Rundeck"
            ],
            "painPoints": [
              "4 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-151, OP-156)",
              "Procedimento não documentado ou só informal em OP-159, OP-178",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem",
              "Dependência de terceiros: Provedores de preços",
              "IBGE / FGV / BACEN"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-151, OP-156, OP-159, OP-178"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-2-1-1",
                "name": "Calcular e divulgar preços de títulos públicos",
                "code": "C2P.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                "scopeBoundary": "Atividade do L3 C2P.2.1 Precificar Títulos Públicos.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-1-2",
                "name": "Divulgar prévia ANBIMA 12h",
                "code": "C2P.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                "scopeBoundary": "Atividade do L3 C2P.2.1 Precificar Títulos Públicos.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-1-3",
                "name": "Calcular VNA de títulos públicos",
                "code": "C2P.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                "scopeBoundary": "Atividade do L3 C2P.2.1 Precificar Títulos Públicos.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-1-4",
                "name": "Divulgar PU 550/238",
                "code": "C2P.2.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                "scopeBoundary": "Atividade do L3 C2P.2.1 Precificar Títulos Públicos.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-2-2",
            "name": "Precificar Títulos Privados",
            "code": "C2P.2.2",
            "description": "Calcula e divulga taxas e preços indicativos de crédito privado.",
            "objective": "Calcula e divulga taxas e preços indicativos de crédito privado.",
            "valueProposition": "Calcular e publicar diariamente os preços de referência a ser utilizados pelo mercado / Calcular e publicar diariamente os spreads de crédito implícitos nas taxas indicatuvas… / Utilização np proesso de precificação e dar referência ao mercado das NTN-Bs…",
            "scopeBoundary": "Atividades L4: Precificar debêntures; Precificar FIDC; Precificar Letras Financeiras; Precificar CRA/CRI; Calcular e divulgar Z-spread; Calcular vértices NTN-B para títulos privados. Macroprocessos AS-IS: OP-150, OP-152, OP-153, OP-154, OP-155, OP-161.",
            "inputs": "Arquivos de preços das instituições informantes e ofertas das corretoras; planilhas de…; Arquivos de preços das instituições informantes e ofertas das corretoras; planilhas de… Fornecedores: Instituições participantes; Fornecedor/prestador externo.",
            "outputs": "Preços publicados nos canais de divulgação (portal, portal associados, feed, data),…; Preços publicados nos canais de divulgação (feed, data), arquivos em excel com as…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-2-2-pol-1",
                "name": "Contrato de licenciamento dos preços / não há prazo definido no contrato, mas o prazo…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-c2p-2-2-pol-2",
                "name": "Após a divulgação dos preços de referência das debêntures",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 5, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ARC",
              "Sistema interno - SUP privados",
              "Debêntures",
              "Sistema call corretores",
              "Databricks",
              "Brevo",
              "Microsoft Outlook"
            ],
            "painPoints": [
              "6 de 6 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 6 macroprocesso(s) (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161)",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem",
              "Falta de informação ao mercado, e falta de referência de preço para ativos privados…",
              "Dependência de terceiros: Provedores de preços, B3",
              "Provedores de preços"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-150, OP-152, OP-153, OP-154, OP-155, OP-161"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-2-2-1",
                "name": "Precificar debêntures",
                "code": "C2P.2.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-2-2",
                "name": "Precificar FIDC",
                "code": "C2P.2.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-2-3",
                "name": "Precificar Letras Financeiras",
                "code": "C2P.2.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-2-4",
                "name": "Precificar CRA/CRI",
                "code": "C2P.2.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-2-5",
                "name": "Calcular e divulgar Z-spread",
                "code": "C2P.2.2.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-2-6",
                "name": "Calcular vértices NTN-B para títulos privados",
                "code": "C2P.2.2.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                "scopeBoundary": "Atividade do L3 C2P.2.2 Precificar Títulos Privados.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-2-3",
            "name": "Calcular Curvas de Referência",
            "code": "C2P.2.3",
            "description": "Calcula curvas de juros, inflação implícita e crédito.",
            "objective": "Calcula curvas de juros, inflação implícita e crédito.",
            "valueProposition": "Disponibilizar ao mercado as curvas referência de fechamento Pré-fixadas, Pós-fixadas… / Referência apra precificação de ativos privados.",
            "scopeBoundary": "Atividades L4: Calcular curvas ETTJ (pré, IPCA e inflação implícita); Calcular e divulgar curvas de crédito. Macroprocessos AS-IS: OP-158, OP-177.",
            "inputs": "Taxas indicativas calculadas diariamente dos títulos públicos; Dados cadastrais, preços, taxas e eventos. Fornecedores: Instituições participantes; Área interna.",
            "outputs": "Curvas de fechamento para os diversos prazos conforme a duração dos ativos insumo das…; Curva publicada nos sites (associados, portal) com arquivos para download e arquivos…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-2-3-pol-1",
                "name": "Juntamente com as taxas e preços dos títulos públicos, com SLA às 19 horas",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "NAI",
              "MATLAB",
              "Rundeck"
            ],
            "painPoints": [
              "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-158, OP-177)",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem",
              "Dependência de terceiros: Provedores de preços",
              "Matlab"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-158, OP-177"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-2-3-1",
                "name": "Calcular curvas ETTJ (pré, IPCA e inflação implícita)",
                "code": "C2P.2.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-158, OP-177).",
                "scopeBoundary": "Atividade do L3 C2P.2.3 Calcular Curvas de Referência.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-3-2",
                "name": "Calcular e divulgar curvas de crédito",
                "code": "C2P.2.3.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-158, OP-177).",
                "scopeBoundary": "Atividade do L3 C2P.2.3 Calcular Curvas de Referência.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-2-4",
            "name": "Gerir Insumos e Ferramentas de Precificação",
            "code": "C2P.2.4",
            "description": "Gerencia contribuidores de taxas e ferramentas de cálculo abertas ao mercado.",
            "objective": "Gerencia contribuidores de taxas e ferramentas de cálculo abertas ao mercado.",
            "valueProposition": "Informar ao mercado os preços que estão sendo praticados n o mercado ao liongo do dia… / Disponibilizar ao mercado, ferramentas de cálculo de taxas e preços para os diversos…",
            "scopeBoundary": "Atividades L4: Consolidar e divulgar call das corretoras; Manter calculadora de títulos públicos, debêntures e CRI/CRA; Gerir painel de contribuidores de taxas . Macroprocessos AS-IS: OP-160, OP-157.",
            "inputs": "Preços de conpra e venda de títulos públicos praticados nas corretorqas de valores; Consulta às fontes de informação de cadastro dos ativos, escrituras de debêntures e… Fornecedores: Instituições participantes.",
            "outputs": "Informaçoes ao mercado sobre os resultados dos calls; Informações de taxas, preços, duration, informações cadastrais, fluxo de pagamentos.",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-2-4-pol-1",
                "name": "Acesso sem restrições de horário",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "SUP",
              "ANBIMA Data",
              "ARC",
              "NAI"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-157)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Falta de informação ao mercado, e falta de referência de preço para validação das…",
              "Exposição pública / dano de imagem",
              "Dependência de terceiros: Corretoras de valores",
              "Agentes Fiduciários, Tesouro nacional"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-160, OP-157"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-2-4-1",
                "name": "Consolidar e divulgar call das corretoras",
                "code": "C2P.2.4.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-160, OP-157).",
                "scopeBoundary": "Atividade do L3 C2P.2.4 Gerir Insumos e Ferramentas de Precificação.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-4-2",
                "name": "Manter calculadora de títulos públicos, debêntures e CRI/CRA",
                "code": "C2P.2.4.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-160, OP-157).",
                "scopeBoundary": "Atividade do L3 C2P.2.4 Gerir Insumos e Ferramentas de Precificação.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-2-4-3",
                "name": "Gerir painel de contribuidores de taxas",
                "code": "C2P.2.4.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 C2P.2.4 Gerir Insumos e Ferramentas de Precificação.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-c2p-3",
        "name": "Calcular e Administrar Índices",
        "code": "C2P.3",
        "description": "Calcular, rebalancear e governar índices e carteiras teóricas.",
        "objective": "Calcular, rebalancear e governar índices e carteiras teóricas.",
        "valueProposition": "Benchmarks confiáveis e auditáveis (IOSCO).",
        "scopeBoundary": "Compreende os L3: C2P.3.1 Calcular Índices de Renda Fixa; C2P.3.2 Calcular Índices de Fundos; C2P.3.3 Rebalancear Carteiras Teóricas; C2P.3.4 Governar Metodologias de Benchmarks. Insere-se no L1 C2P e se limita às atividades descritas nesses L3.",
        "inputs": "Quantidades em mercado, preços, VNA; Vertices da ETTJ e VNA de títulos públicos. Fornecedores: Área interna; Reguladores (BCB/CVM); Selic/Tesouro nacional - cadastro e quantidade em mercado; BCB -Segmento prudencial.",
        "outputs": "índice publicado nos sites (associados, portal e Data) com arquivos para download e…; índice publicado no Data com arquivos para download e arquivos disponibilizados por API.",
        "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
        "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 75,
        "policies": [
          {
            "id": "anb-l2-c2p-3-pol-1",
            "name": "Contrato",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Índices publicados no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Erros de cálculo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 8, Muito Crítico: 7",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Rundeck",
          "Microsoft Excel",
          "NAI",
          "Python"
        ],
        "painPoints": [
          "15 de 15 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 15 macroprocesso(s) (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173, OP-165, OP-164, OP-169, OP-172, OP-176, OP-166, OP-168, OP-171, OP-175)",
          "Uso de Excel em etapas operacionais (9 macroprocesso(s)), com risco de erro manual",
          "Impactos/penalidades declarados: Multa"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-c2p-3-1",
            "name": "Calcular Índices de Renda Fixa",
            "code": "C2P.3.1",
            "description": "Calcula diariamente as famílias de índices de renda fixa.",
            "objective": "Calcula diariamente as famílias de índices de renda fixa.",
            "valueProposition": "Calcular e publicar diariamente os índices de referência usados pelo mercado.",
            "scopeBoundary": "Atividades L4: Calcular família IMA; Calcular família IDKA; Calcular família IDA; Calcular família IDA LIQ; Calcular ILFA; Calcular índices customizados (TD 2035/2050/2060). Macroprocessos AS-IS: OP-163, OP-162, OP-167, OP-170, OP-174, OP-173.",
            "inputs": "Quantidades em mercado, preços, VNA; Vertices da ETTJ e VNA de títulos públicos. Fornecedores: Área interna; Reguladores (BCB/CVM).",
            "outputs": "índice publicado nos sites (associados, portal e Data) com arquivos para download e…; índice publicado no Data com arquivos para download e arquivos disponibilizados por API.",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-3-1-pol-1",
                "name": "Contrato",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 6",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Rundeck",
              "Microsoft Excel",
              "Python",
              "NAI"
            ],
            "painPoints": [
              "6 de 6 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 6 macroprocesso(s) (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173)",
              "Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Multa",
              "Dependência de terceiros: Dados armazenados na AWS",
              "Accenture - View ARC"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-163, OP-162, OP-167, OP-170, OP-174, OP-173"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-3-1-1",
                "name": "Calcular família IMA",
                "code": "C2P.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-1-2",
                "name": "Calcular família IDKA",
                "code": "C2P.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-1-3",
                "name": "Calcular família IDA",
                "code": "C2P.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-1-4",
                "name": "Calcular família IDA LIQ",
                "code": "C2P.3.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-1-5",
                "name": "Calcular ILFA",
                "code": "C2P.3.1.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-1-6",
                "name": "Calcular índices customizados (TD 2035/2050/2060)",
                "code": "C2P.3.1.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                "scopeBoundary": "Atividade do L3 C2P.3.1 Calcular Índices de Renda Fixa.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-3-2",
            "name": "Calcular Índices de Fundos",
            "code": "C2P.3.2",
            "description": "Calcula índices de referência da indústria de fundos.",
            "objective": "Calcula índices de referência da indústria de fundos.",
            "valueProposition": "Calcular e publicar diariamente os índice de referência usados pelo mercado.",
            "scopeBoundary": "Atividades L4: Calcular IHFA. Macroprocessos AS-IS: OP-165.",
            "inputs": "Dados cadastrais e diários (cotas, pl e cotistas). Fornecedores: Área interna.",
            "outputs": "índice publicado nos sites (associados, portal e Data) com arquivos para download e…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Excel",
              "Rundeck"
            ],
            "painPoints": [
              "1 de 1 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-165)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Dependência de terceiros: Dados armazenados na AWS"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-165"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-3-2-1",
                "name": "Calcular IHFA",
                "code": "C2P.3.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-165).",
                "scopeBoundary": "Atividade do L3 C2P.3.2 Calcular Índices de Fundos.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-3-3",
            "name": "Rebalancear Carteiras Teóricas",
            "code": "C2P.3.3",
            "description": "Divulga prévias e rebalanceia carteiras teóricas dos índices.",
            "objective": "Divulga prévias e rebalanceia carteiras teóricas dos índices.",
            "valueProposition": "Apurar e publicar as prévias das carteiras teóricas dos índices da família IMA / Apurar e publicar as prévias das carteiras teóricas dos índices da família IDA / Apurar e publicar as prévias das carteiras teóricas dos índices da família IDA LIQ.",
            "scopeBoundary": "Atividades L4: Divulgar prévia de carteira (IMA, IDA, IDA LIQ, ILFA) [OP-164; OP-169; OP-172; OP-176]; Rebalancear carteiras (IHFA, IDA, IDA LIQ, ILFA) [OP-166; OP-168; OP-171; OP-175]. Macroprocessos AS-IS: OP-164, OP-169, OP-172, OP-176, OP-166, OP-168, OP-171, OP-175.",
            "inputs": "Quantidades em mercado, preços, VNA; Dados cadastrais, preços e eventos. Fornecedores: Reguladores (BCB/CVM); Área interna; Selic/Tesouro nacional - cadastro e quantidade em mercado; BCB -Segmento prudencial.",
            "outputs": "Prévia da carteira que será utilizdo a partir do rebalanceamento do IMA; índice publicado nos sites (associados, portal e Data) com arquivos para download e…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Preços, Índices e Modelagens. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-3-3-pol-1",
                "name": "Contrato",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Quinzenal, Mensal, Trimestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 8",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Rundeck",
              "Microsoft Excel",
              "NAI",
              "Python"
            ],
            "painPoints": [
              "8 de 8 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 8 macroprocesso(s) (OP-164, OP-169, OP-172, OP-176, OP-166, OP-168, OP-171, OP-175)",
              "Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Multa",
              "Dependência de terceiros: Dados armazenados na AWS",
              "Accenture - View ARC"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-164, OP-169, OP-172, OP-176, OP-166, OP-168, OP-171, OP-175"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-3-3-1",
                "name": "Divulgar prévia de carteira (IMA, IDA, IDA LIQ, ILFA)",
                "code": "C2P.3.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-164; OP-169; OP-172; OP-176).",
                "scopeBoundary": "Atividade do L3 C2P.3.3 Rebalancear Carteiras Teóricas.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-3-2",
                "name": "Rebalancear carteiras (IHFA, IDA, IDA LIQ, ILFA)",
                "code": "C2P.3.3.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-166; OP-168; OP-171; OP-175).",
                "scopeBoundary": "Atividade do L3 C2P.3.3 Rebalancear Carteiras Teóricas.",
                "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-3-4",
            "name": "Governar Metodologias de Benchmarks",
            "code": "C2P.3.4",
            "description": "Garante governança, transparência e controle das metodologias, conforme princípios IOSCO.",
            "objective": "Garante governança, transparência e controle das metodologias, conforme princípios IOSCO.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 C2P.3 Calcular e Administrar Índices.",
            "scopeBoundary": "Atividades L4 propostas: Manter e revisar metodologias de preços e índices ; Operar comitê de supervisão de benchmarks ; Tratar contestações, erros e republicações.",
            "inputs": "Diretrizes estratégicas e normativas do L1 C2P; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 C2P.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-c2p-3-4-pol-1",
                "name": "Princípios IOSCO para Benchmarks Financeiros",
                "type": "Norma Regulatória",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-c2p-3-4-pol-2",
                "name": "metodologias públicas ANBIMA",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "OpenMetadata (linhagem) (sugerido)",
              "SharePoint (metodologias) (sugerido)",
              "Jira (comitê/controle de mudanças) (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-3-4-1",
                "name": "Manter e revisar metodologias de preços e índices",
                "code": "C2P.3.4.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 C2P.3.4 Governar Metodologias de Benchmarks.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-4-2",
                "name": "Operar comitê de supervisão de benchmarks",
                "code": "C2P.3.4.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 C2P.3.4 Governar Metodologias de Benchmarks.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-3-4-3",
                "name": "Tratar contestações, erros e republicações",
                "code": "C2P.3.4.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 C2P.3.4 Governar Metodologias de Benchmarks.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-c2p-4",
        "name": "Produzir Estatísticas e Rankings",
        "code": "C2P.4",
        "description": "Produzir estatísticas, rankings, boletins e projeções.",
        "objective": "Produzir estatísticas, rankings, boletins e projeções.",
        "valueProposition": "Informação de referência sobre a indústria para mercado e imprensa.",
        "scopeBoundary": "Compreende os L3: C2P.4.1 Produzir Rankings; C2P.4.2 Produzir Boletins, Relatórios e Projeções. Insere-se no L1 C2P e se limita às atividades descritas nesses L3.",
        "inputs": "Formulários encaminhados através do site de fundo, Planilhas de depuração geradas em…; Base de fundos, Planilhas geradas em processos automatizados e Planilhas de controle… Fornecedores: Instituições participantes; Fontes externas: IBGE (IPCA) e FGV (IGP-M) fornecem calendário e resultado oficial;…",
        "outputs": "Ranking e Relatórios Publicados no ANBIMA Data; Ranking de renda fixa & híbridos, renda variável.",
        "stakeholders": "Áreas executoras: Plataforma de operações, Representação de Mercados, Fundos, Mercados de Capitais e Distribuição. Destinos: Mercado em geral; Associados recebem por e-mail às 17h30; mercado em geral recebe via site às 18h.",
        "responsible": "Plataforma de operações, Representação de Mercados, Fundos, Mercados de Capitais e Distribuição",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-c2p-4-pol-1",
            "name": "Sim - Contratos de Divulgação ANBIMA Feed Sim - Código de Administração e Gestão de…",
            "type": "Referência de Mercado",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-c2p-4-pol-2",
            "name": "Sim - compromisso público divulgado",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Publicações no calendário",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Alcance/downloads",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 6, Muito Crítico: 2, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Fundos",
          "Microsoft PowerPoint",
          "Hub ANBIMA",
          "Microsoft SharePoint",
          "Power BI",
          "Databricks",
          "Dataiku",
          "Sistema de Ranking (Envio de dados)"
        ],
        "painPoints": [
          "8 de 9 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-132, OP-133, OP-134, OP-148, OP-149)",
          "Procedimento não documentado ou só informal em OP-213",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-c2p-4-1",
            "name": "Produzir Rankings",
            "code": "C2P.4.1",
            "description": "Elabora rankings de fundos e mercado de capitais.",
            "objective": "Elabora rankings de fundos e mercado de capitais.",
            "valueProposition": "Distribuição de dados de fundos de investimento para o público diverso (associados,… / Consolidar, validar, aplicar as metodologias e publicar rankings de mercado de… / Consolidar operações externas elegíveis, calcular as posições de advisers e publicar o…",
            "scopeBoundary": "Atividades L4: Elaborar rankings de fundos (SQ, gestão e administração, global) [OP-132; OP-133; OP-134]; Elaborar rankings de mercado de capitais (local e externo) [OP-148; OP-149]. Macroprocessos AS-IS: OP-132, OP-133, OP-134, OP-148, OP-149.",
            "inputs": "Formulários encaminhados através do site de fundo, Planilhas de depuração geradas em…; Base de fundos, Planilhas geradas em processos automatizados e Planilhas de controle… Fornecedores: Instituições participantes.",
            "outputs": "Ranking e Relatórios Publicados no ANBIMA Data; Ranking de renda fixa & híbridos, renda variável.",
            "stakeholders": "Áreas executoras: Plataforma de operações, Fundos, Mercados de Capitais e Distribuição. Destinos: Mercado em geral.",
            "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-4-1-pol-1",
                "name": "Sim - Contratos de Divulgação ANBIMA Feed Sim - Código de Administração e Gestão de…",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 4, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Fundos",
              "Microsoft PowerPoint",
              "Databricks",
              "Dataiku",
              "Sistema de Ranking (Envio de dados)",
              "Cognito"
            ],
            "painPoints": [
              "4 de 5 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 5 macroprocesso(s) (OP-132, OP-133, OP-134, OP-148, OP-149)"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-132, OP-133, OP-134, OP-148, OP-149"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-4-1-1",
                "name": "Elaborar rankings de fundos (SQ, gestão e administração, global)",
                "code": "C2P.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-132; OP-133; OP-134).",
                "scopeBoundary": "Atividade do L3 C2P.4.1 Produzir Rankings.",
                "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-4-1-2",
                "name": "Elaborar rankings de mercado de capitais (local e externo)",
                "code": "C2P.4.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-148; OP-149).",
                "scopeBoundary": "Atividade do L3 C2P.4.1 Produzir Rankings.",
                "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-4-2",
            "name": "Produzir Boletins, Relatórios e Projeções",
            "code": "C2P.4.2",
            "description": "Publica boletins, relatórios e projeções macroeconômicas.",
            "objective": "Publica boletins, relatórios e projeções macroeconômicas.",
            "valueProposition": "Distribuição de dados de fundos de investimento para o público diverso (associados,… / Consolidar as projeções de IPCA e IGP-M enviadas pelos associados, calculando a média…",
            "scopeBoundary": "Atividades L4: Elaborar boletim de fundos; Elaborar relatório diário de fundos; Elaborar relatórios diversos de fundos; Consolidar e divulgar projeções de IPCA e IGP-M. Macroprocessos AS-IS: OP-136, OP-137, OP-138, OP-213.",
            "inputs": "Bases consolidadas no Power BI (base analítica de fundos é o principal insumo),…; Calendário de divulgação do IBGE (IPCA) e da FGV (IGP-M); resultado oficial do índice… Fornecedores: Instituições participantes; Fontes externas: IBGE (IPCA) e FGV (IGP-M) fornecem calendário e resultado oficial;…",
            "outputs": "Relatórios Publicados no ANBIMA Data; Informações diversas compartilhadas com a imprensa, órgão regulador, áreas internas,…",
            "stakeholders": "Áreas executoras: Plataforma de operações, Representação de Mercados, Fundos. Destinos: Mercado em geral; Associados recebem por e-mail às 17h30; mercado em geral recebe via site às 18h.",
            "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-4-2-pol-1",
                "name": "Sim - Contratos de Divulgação ANBIMA Feed Sim - Código de Administração e Gestão de…",
                "type": "Referência de Mercado",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-c2p-4-2-pol-2",
                "name": "Sim - compromisso público divulgado",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal, Diário, Trimestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 2, Muito Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Hub ANBIMA",
              "Microsoft SharePoint",
              "Power BI",
              "Brevo",
              "Microsoft Excel"
            ],
            "painPoints": [
              "4 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-213",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem (não há penalidade financeira/contratual…; dependência de terceiros: PowerBI: execução das consultas pra gerar os relatórios Sharepoint: Planilhas internas; Lumis (provedor do website ANBIMA) - indispensável para a publicação da projeção no…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-136, OP-137, OP-138, OP-213"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-4-2-1",
                "name": "Elaborar boletim de fundos",
                "code": "C2P.4.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                "scopeBoundary": "Atividade do L3 C2P.4.2 Produzir Boletins, Relatórios e Projeções.",
                "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-4-2-2",
                "name": "Elaborar relatório diário de fundos",
                "code": "C2P.4.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                "scopeBoundary": "Atividade do L3 C2P.4.2 Produzir Boletins, Relatórios e Projeções.",
                "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-4-2-3",
                "name": "Elaborar relatórios diversos de fundos",
                "code": "C2P.4.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                "scopeBoundary": "Atividade do L3 C2P.4.2 Produzir Boletins, Relatórios e Projeções.",
                "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-4-2-4",
                "name": "Consolidar e divulgar projeções de IPCA e IGP-M",
                "code": "C2P.4.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                "scopeBoundary": "Atividade do L3 C2P.4.2 Produzir Boletins, Relatórios e Projeções.",
                "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-c2p-5",
        "name": "Desenvolver e Distribuir Produtos de Dados",
        "code": "C2P.5",
        "description": "Desenvolver, distribuir e dar suporte a produtos de dados.",
        "objective": "Desenvolver, distribuir e dar suporte a produtos de dados.",
        "valueProposition": "Acesso fácil e monetizável aos dados ANBIMA.",
        "scopeBoundary": "Compreende os L3: C2P.5.1 Gerir Portfólio de Produtos de Dados; C2P.5.2 Distribuir Dados ao Mercado; C2P.5.3 Atender Consumidores de Dados. Insere-se no L1 C2P e se limita às atividades descritas nesses L3.",
        "inputs": "Requisitos de negócio, dicionário de dados, bases do lakehouse, repositório de código; Bases de dados da ANBIMA (preços, índices, fundos, estatísticas de mercado); documento… Fornecedores: Área interna; Fornecedor/prestador externo; Origens: associados, assinantes do ANBIMA Feed e Atendimento.",
        "outputs": "Produto de dados publicado (tabela curada, API ou painel) com documentação; Produto de dados, como por exemplo, um dashboard, um dataset ou uma nova tela no…",
        "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II. Destinos: Áreas internas; Associados; Mercado em geral; Públicos: associados, assinantes/clientes do Feed e áreas internas.",
        "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-c2p-5-pol-1",
            "name": "Sim - compromisso público divulgado",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Disponibilidade Feed/Data",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Receita de dados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "SLA de suporte",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4, Muito Crítico: 3, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Databricks",
          "ANBIMA Feed",
          "ANBIMA Data",
          "Microsoft Teams",
          "ClickUp",
          "Jira",
          "Hub Fundos (Galgo)",
          "Power Automate"
        ],
        "painPoints": [
          "3 de 8 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-111, OP-124, OP-126, OP-114, OP-115)",
          "Dependência de pessoa-chave em OP-102",
          "Procedimento não documentado ou só informal em OP-125, OP-102, OP-128"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-c2p-5-1",
            "name": "Gerir Portfólio de Produtos de Dados",
            "code": "C2P.5.1",
            "description": "Define estratégia e desenvolve produtos de dados ao mercado.",
            "objective": "Define estratégia e desenvolve produtos de dados ao mercado.",
            "valueProposition": "Desenvolver produtos de dados (tabelas curadas, APIs e painéis) que atendam às… / Criar ou recriar um produto de dados para ser distribuído para o público externo,… / Atender solicitações específicas de áreas internas (extrações, análises, relatórios e…",
            "scopeBoundary": "Atividades L4: Definir estratégia e portfólio de produtos de dados; Desenvolver produto de dados; Desenvolver demandas pontuais de dados. Macroprocessos AS-IS: OP-111, OP-124, OP-126.",
            "inputs": "Requisitos de negócio, dicionário de dados, bases do lakehouse, repositório de código; Bases de dados da ANBIMA (preços, índices, fundos, estatísticas de mercado); documento… Fornecedores: Área interna.",
            "outputs": "Produto de dados publicado (tabela curada, API ou painel) com documentação; Produto de dados, como por exemplo, um dashboard, um dataset ou uma nova tela no…",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Produtos de dados e IA. Destinos: Áreas internas; Associados.",
            "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Databricks",
              "ANBIMA Data",
              "ANBIMA Feed",
              "ClickUp",
              "Jira",
              "Microsoft Teams"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-111, OP-124, OP-126)",
              "Impactos/penalidades declarados: Não há penalidade formal",
              "Dependência de terceiros: Databricks e AWS — indispensáveis para desenvolvimento e hospedagem",
              "Sim -fornecedores de produtos de dados (dataviz e designer) e fornecedores de…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-111, OP-124, OP-126"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-5-1-1",
                "name": "Definir estratégia e portfólio de produtos de dados",
                "code": "C2P.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                "scopeBoundary": "Atividade do L3 C2P.5.1 Gerir Portfólio de Produtos de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-5-1-2",
                "name": "Desenvolver produto de dados",
                "code": "C2P.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                "scopeBoundary": "Atividade do L3 C2P.5.1 Gerir Portfólio de Produtos de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-5-1-3",
                "name": "Desenvolver demandas pontuais de dados",
                "code": "C2P.5.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                "scopeBoundary": "Atividade do L3 C2P.5.1 Gerir Portfólio de Produtos de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-5-2",
            "name": "Distribuir Dados ao Mercado",
            "code": "C2P.5.2",
            "description": "Disponibiliza e sustenta os canais de distribuição (ANBIMA Data, Feed, Galgo).",
            "objective": "Disponibiliza e sustenta os canais de distribuição (ANBIMA Data, Feed, Galgo).",
            "valueProposition": "Garantir a integração e a disponibilização dos dados da plataforma para o produto… / Garantir a disponibilidade, a qualidade e a atualização dos produtos de dados em… / Prestar suporte técnico em regime de plantão à operação diária de cálculo e divulgação…",
            "scopeBoundary": "Atividades L4: Integrar ANBIMA Data/Feed; Sustentar produto de dados; Sustentar processamento de preços e índices; Processar dados intermediários Galgo. Macroprocessos AS-IS: OP-114, OP-125, OP-115, OP-102.",
            "inputs": "Bases de preços e índices, dados de fundos, catálogo de dados, contratos de interface…; Chamados/tickets; logs de carga e de monitoramento; bases de dados; documentação… Fornecedores: Área interna; Fornecedor/prestador externo.",
            "outputs": "Dados disponibilizados na plataforma ANBIMA Data para consumo do mercado; Produto de dados estável e corrigido em produção, chamado resolvido e comunicação aos…",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II. Destinos: Mercado em geral; Áreas internas.",
            "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-c2p-5-2-pol-1",
                "name": "Sim - compromisso público divulgado",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2, Baixo: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Databricks",
              "ANBIMA Data",
              "ANBIMA Feed",
              "Hub Fundos (Galgo)",
              "Power Automate"
            ],
            "painPoints": [
              "2 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-114, OP-115)",
              "Dependência de pessoa-chave em OP-102",
              "Procedimento não documentado ou só informal em OP-125, OP-102",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem",
              "Não há penalidade formal",
              "Dependência de terceiros: Databricks e AWS — indispensáveis para processamento e entrega dos dados",
              "Sim - fornecedor de sustentação/desenvolvimento"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-114, OP-125, OP-115, OP-102"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-5-2-1",
                "name": "Integrar ANBIMA Data/Feed",
                "code": "C2P.5.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                "scopeBoundary": "Atividade do L3 C2P.5.2 Distribuir Dados ao Mercado.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-5-2-2",
                "name": "Sustentar produto de dados",
                "code": "C2P.5.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                "scopeBoundary": "Atividade do L3 C2P.5.2 Distribuir Dados ao Mercado.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-5-2-3",
                "name": "Sustentar processamento de preços e índices",
                "code": "C2P.5.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                "scopeBoundary": "Atividade do L3 C2P.5.2 Distribuir Dados ao Mercado.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-c2p-5-2-4",
                "name": "Processar dados intermediários Galgo",
                "code": "C2P.5.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                "scopeBoundary": "Atividade do L3 C2P.5.2 Distribuir Dados ao Mercado.",
                "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-c2p-5-3",
            "name": "Atender Consumidores de Dados",
            "code": "C2P.5.3",
            "description": "Esclarece dúvidas de usuários de produtos de dados.",
            "objective": "Esclarece dúvidas de usuários de produtos de dados.",
            "valueProposition": "Responder dúvidas de usuários e clientes sobre dados, metodologias, acesso e uso do…",
            "scopeBoundary": "Atividades L4: Atender dúvidas sobre ANBIMA Data e Feed. Macroprocessos AS-IS: OP-128.",
            "inputs": "Documentação do ANBIMA Data e da API do ANBIMA Feed; bases de dados; metodologias… Fornecedores: Origens: associados, assinantes do ANBIMA Feed e Atendimento.",
            "outputs": "Resposta ao usuário e atualização de FAQ/documentação.",
            "stakeholders": "Áreas executoras: Tecnologia, Produtos de dados e IA. Destinos: Públicos: associados, assinantes/clientes do Feed e áreas internas.",
            "responsible": "Tecnologia, Produtos de dados e IA",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Feed",
              "Microsoft Outlook",
              "Microsoft Teams"
            ],
            "painPoints": [
              "1 de 1 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-128",
              "Impactos/penalidades declarados: Não há penalidade formal"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-128"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-c2p-5-3-1",
                "name": "Atender dúvidas sobre ANBIMA Data e Feed",
                "code": "C2P.5.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-128).",
                "scopeBoundary": "Atividade do L3 C2P.5.3 Atender Consumidores de Dados.",
                "responsible": "Tecnologia, Produtos de dados e IA",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-e2c",
    "name": "Educar a Certificar",
    "code": "E2C",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Desenhar, aplicar e manter as certificações profissionais ANBIMA e promover educação continuada e financeira, garantindo profissionais qualificados para o mercado.",
    "objective": "Desenhar, aplicar e manter as certificações profissionais ANBIMA e promover educação continuada e financeira, garantindo profissionais qualificados para o mercado.",
    "valueProposition": "Assegurar que os profissionais do mercado tenham conhecimentos mínimos exigidos pela regulação e autorregulação, aumentando a proteção do investidor e a qualidade da distribuição de produtos.",
    "scopeBoundary": "Abrange do desenho do portfólio e banco de questões à aplicação dos exames (com parceiros aplicadores), manutenção e equivalência de certificados, educação continuada, educação financeira e atendimento a candidatos e certificados.",
    "inputs": "Exigências regulatórias e de autorregulação; diretrizes de comitês de certificação; conteúdo técnico; inscrições de candidatos; parceiros aplicadores (FGV, Cesgranrio) e de equivalência (CFA, CAIA).",
    "outputs": "Editais, programas detalhados e matriz de avaliação; exames aplicados e resultados; certificados emitidos, atualizados e mantidos; cursos e trilhas; programas de educação financeira; atendimentos resolvidos.",
    "stakeholders": "Educação; Relacionamento; Tecnologia; parceiros FGV, Cesgranrio, Happmobi. Destinos: candidatos, profissionais certificados, instituições participantes, reguladores.",
    "responsible": "Educação, Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-e2c-pol-1",
        "name": "Código ANBIMA de Certificação",
        "type": "Autorregulação ANBIMA",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-e2c-pol-2",
        "name": "editais dos exames",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-e2c-pol-3",
        "name": "contratos com aplicadores e parceiros de equivalência",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-e2c-pol-4",
        "name": "Resolução CVM sobre qualificação de profissionais",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Nº de exames/mês (~10 mil)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Taxa de aprovação",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Incidentes de fraude",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "% certificados atualizados no prazo",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "NPS/SLA de atendimento (5 dias úteis)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "ANBIMA Edu",
      "Anbima Edu BKO",
      "Portal ANBIMA",
      "Plataforma da Cesgranrio (Saúde do Banco de Itens)",
      "API de agendamento (FGV e Cesgranrio)",
      "Plataforma de aplicação (Cesgranrio)",
      "Plataforma de aplicação (Cesgranrio) - monitoramento remoto/IA e fiscalização",
      "Sistema de faturamento/pagamento (voucher e boleto)",
      "ANBIMA Edu (formulário de dispensa)",
      "SSM",
      "LMS Happmobi",
      "Como Investir",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: ANBIMA Edu (+BKO) como plataforma central do ciclo do certificado",
      "TO-BE: plataforma Cesgranrio/API FGV para aplicação",
      "TO-BE: LMS Happmobi para educação continuada",
      "TO-BE: Zendesk para atendimento",
      "TO-BE: SSM para vínculo certificado-instituição"
    ],
    "painPoints": [
      "Forte dependência de aplicadores externos",
      "Volume elevado com risco de fraude",
      "Risco de judicialização por candidatos",
      "Integração entre plataformas (Edu, Cesgranrio, faturamento) frágil"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-e2c-1",
        "name": "Desenhar Certificações",
        "code": "E2C.1",
        "description": "Desenhar certificações e manter o banco de questões.",
        "objective": "Desenhar certificações e manter o banco de questões.",
        "valueProposition": "Certificações aderentes às exigências e ao mercado.",
        "scopeBoundary": "Compreende os L3: E2C.1.1 Definir Escopo e Requisitos; E2C.1.2 Gerir Banco de Questões. Insere-se no L1 E2C e se limita às atividades descritas nesses L3.",
        "inputs": "Edital dos Exames das Certificações Anbima, Regras e Procedimentos para Realização das…; Programa Detalhado, matriz de avaliação, estatísticas psicométricas (dashboard \"Saúde… Fornecedores: Área interna; Mais de uma área interna contribui com insumos para este macroprocesso, cada uma em um…",
        "outputs": "Documento \"Orientações e Informações Técnicas para Certificações ANBIMA\" atualizado e…; Banco de itens validado, seguro e atualizado para geração das provas; relatórios de…",
        "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
        "responsible": "Educação",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-e2c-1-pol-1",
            "name": "Não há prazo formal fixo",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-e2c-1-pol-2",
            "name": "porém, a publicação deve anteceder a vigência de cada nova regra",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-e2c-1-pol-3",
            "name": "Sob demanda",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Itens válidos no banco",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Editais publicados no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 2",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Microsoft SharePoint",
          "Portal ANBIMA",
          "ANBIMA Edu",
          "Plataforma da Cesgranrio (Saúde do Banco de Itens)"
        ],
        "painPoints": [
          "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Procedimento não documentado ou só informal em OP-195",
          "Impactos/penalidades declarados: Não há penalidade formal direta, mas risco de contestação/judicialização por…",
          "Anulação de exames",
          "Cancelamento de certificações obtidas de forma fraudulenta",
          "…",
          "Dependência de terceiros: Sim - Cesgranrio, aplicadora responsável pelos dados e estatísticas psicométricas dos…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-e2c-1-1",
            "name": "Definir Escopo e Requisitos",
            "code": "E2C.1.1",
            "description": "Define portfólio, requisitos e documentação técnico-normativa das certificações.",
            "objective": "Define portfólio, requisitos e documentação técnico-normativa das certificações.",
            "valueProposition": "Manter atualizado o documento público \"Orientações e Informações Técnicas para…",
            "scopeBoundary": "Atividades L4: Revisar portfólio de certificações ; Elaborar documento de orientações técnicas das certificações. Macroprocessos AS-IS: OP-201.",
            "inputs": "Edital dos Exames das Certificações Anbima, Regras e Procedimentos para Realização das… Fornecedores: Mais de uma área interna contribui com insumos para este macroprocesso, cada uma em um…",
            "outputs": "Documento \"Orientações e Informações Técnicas para Certificações ANBIMA\" atualizado e…",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-e2c-1-1-pol-1",
                "name": "Não há prazo formal fixo",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-e2c-1-1-pol-2",
                "name": "porém, a publicação deve anteceder a vigência de cada nova regra",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft SharePoint",
              "Portal ANBIMA"
            ],
            "painPoints": [
              "1 de 1 macroprocessos classificados como Crítico/Muito Crítico",
              "Impactos/penalidades declarados: Não há penalidade formal direta, mas risco de contestação/judicialização por…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-201"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-1-1-1",
                "name": "Revisar portfólio de certificações",
                "code": "E2C.1.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 E2C.1.1 Definir Escopo e Requisitos.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-1-1-2",
                "name": "Elaborar documento de orientações técnicas das certificações",
                "code": "E2C.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-201).",
                "scopeBoundary": "Atividade do L3 E2C.1.1 Definir Escopo e Requisitos.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-e2c-1-2",
            "name": "Gerir Banco de Questões",
            "code": "E2C.1.2",
            "description": "Mantém matriz de avaliação e itens de prova.",
            "objective": "Mantém matriz de avaliação e itens de prova.",
            "valueProposition": "Manter, atualizar e garantir a qualidade, o sigilo e a validade psicométrica do banco…",
            "scopeBoundary": "Atividades L4: Gerir banco de questões e matriz de avaliação. Macroprocessos AS-IS: OP-195.",
            "inputs": "Programa Detalhado, matriz de avaliação, estatísticas psicométricas (dashboard \"Saúde… Fornecedores: Área interna.",
            "outputs": "Banco de itens validado, seguro e atualizado para geração das provas; relatórios de…",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-e2c-1-2-pol-1",
                "name": "Sob demanda",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Contínuo (tempo real)",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Edu",
              "Plataforma da Cesgranrio (Saúde do Banco de Itens)"
            ],
            "painPoints": [
              "1 de 1 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-195",
              "Impactos/penalidades declarados: Anulação de exames",
              "Cancelamento de certificações obtidas de forma fraudulenta",
              "…",
              "Dependência de terceiros: Sim - Cesgranrio, aplicadora responsável pelos dados e estatísticas psicométricas dos…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-195"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-1-2-1",
                "name": "Gerir banco de questões e matriz de avaliação",
                "code": "E2C.1.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-195).",
                "scopeBoundary": "Atividade do L3 E2C.1.2 Gerir Banco de Questões.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-e2c-2",
        "name": "Aplicar Exames",
        "code": "E2C.2",
        "description": "Aplicar exames com integridade e julgar recursos.",
        "objective": "Aplicar exames com integridade e julgar recursos.",
        "valueProposition": "Exames seguros, acessíveis e confiáveis.",
        "scopeBoundary": "Compreende os L3: E2C.2.1 Operar Exames e Garantir Integridade. Insere-se no L1 E2C e se limita às atividades descritas nesses L3.",
        "inputs": "Edital dos Exames das Certificações Anbima, Programa Detalhado, Banco de Questões,…; Processo de Detecção Proativa de Fraudes (matriz de classificação e sanções), Código… Fornecedores: Área interna; Fornecedor/prestador externo.",
        "outputs": "Resultado do exame (aprovação/reprovação), certificado digital; Classificação do caso; decisão sancionatória (eliminação, anulação, suspensão).",
        "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral; Áreas internas.",
        "responsible": "Educação",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-e2c-2-pol-1",
            "name": "Sim - prazo de autorregulação ANBIMA",
            "type": "Autorregulação ANBIMA",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Exames/mês",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Incidentes de fraude",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Recursos no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 2, Muito Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ANBIMA Edu",
          "API de agendamento (FGV e Cesgranrio)",
          "Plataforma de aplicação (Cesgranrio)",
          "Microsoft Excel",
          "Plataforma de aplicação (Cesgranrio) - monitoramento remoto/IA e fiscalização"
        ],
        "painPoints": [
          "3 de 3 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-196)",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Impactos/penalidades declarados: Descumprimento do Edital/Código de Autorregulação",
          "Risco de judicialização por parte…",
          "Anulação de exames",
          "Cancelamento de certificações",
          "Suspensão de novos exames",
          "Medidas…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-e2c-2-1",
            "name": "Operar Exames e Garantir Integridade",
            "code": "E2C.2.1",
            "description": "Aplica exames, detecta fraudes e julga recursos.",
            "objective": "Aplica exames, detecta fraudes e julga recursos.",
            "valueProposition": "Aplicar os exames de certificação Anbima com segurança, integridade e dentro do prazo,… / Detectar, analisar, prevenir e sancionar condutas que comprometam o resultado ou o… / Respondermos aos recursos impetrados pelas pessoas candidatas nos exames anbima. Elas…",
            "scopeBoundary": "Atividades L4: Aplicar e gerir exames de certificação; Detectar fraudes proativamente; Julgar recursos de candidatos. Macroprocessos AS-IS: OP-192, OP-197, OP-196.",
            "inputs": "Edital dos Exames das Certificações Anbima, Programa Detalhado, Banco de Questões,…; Processo de Detecção Proativa de Fraudes (matriz de classificação e sanções), Código… Fornecedores: Área interna; Fornecedor/prestador externo.",
            "outputs": "Resultado do exame (aprovação/reprovação), certificado digital; Classificação do caso; decisão sancionatória (eliminação, anulação, suspensão).",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral; Áreas internas.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-e2c-2-1-pol-1",
                "name": "Sim - prazo de autorregulação ANBIMA",
                "type": "Autorregulação ANBIMA",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Contínuo (tempo real)",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 2, Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Edu",
              "API de agendamento (FGV e Cesgranrio)",
              "Plataforma de aplicação (Cesgranrio)",
              "Microsoft Excel",
              "Plataforma de aplicação (Cesgranrio) - monitoramento remoto/IA e fiscalização"
            ],
            "painPoints": [
              "3 de 3 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-196)",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Descumprimento do Edital/Código de Autorregulação",
              "Risco de judicialização por parte…",
              "Anulação de exames",
              "Cancelamento de certificações",
              "Suspensão de novos exames",
              "Medidas…",
              "Dependência de terceiros: Sim - FGV e Cesgranrio, instituições contratadas responsáveis pela aplicação…",
              "Sim - Cesgranrio e FGV, responsáveis pela fiscalização presencial/remota e pelas…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-192, OP-197, OP-196"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-2-1-1",
                "name": "Aplicar e gerir exames de certificação",
                "code": "E2C.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                "scopeBoundary": "Atividade do L3 E2C.2.1 Operar Exames e Garantir Integridade.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-2-1-2",
                "name": "Detectar fraudes proativamente",
                "code": "E2C.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                "scopeBoundary": "Atividade do L3 E2C.2.1 Operar Exames e Garantir Integridade.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-2-1-3",
                "name": "Julgar recursos de candidatos",
                "code": "E2C.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                "scopeBoundary": "Atividade do L3 E2C.2.1 Operar Exames e Garantir Integridade.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-e2c-3",
        "name": "Manter Certificações",
        "code": "E2C.3",
        "description": "Manter certificados válidos, atualizados e equivalências concedidas.",
        "objective": "Manter certificados válidos, atualizados e equivalências concedidas.",
        "valueProposition": "Base de certificados confiável para instituições e reguladores.",
        "scopeBoundary": "Compreende os L3: E2C.3.1 Gerir Ciclo de Vida do Certificado. Insere-se no L1 E2C e se limita às atividades descritas nesses L3.",
        "inputs": "Anexo 1 do Edital (Atualização das Certificações Anbima), Orientações e Informações…; Acordos de equivalência (CFA, CAIA, EIP/EFPA), Orientações e Informações Técnicas para… Fornecedores: Área interna; A entrada ocorre por meio da solicitação dos profissionais via Cognito. Quem fornece…",
        "outputs": "Certificação atualizada/ativa; ou inativação (até 3 anos) ou vencimento definitivo da…; Certificação concedida por equivalência; ou indeferimento fundamentado do pedido.",
        "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
        "responsible": "Educação",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-e2c-3-pol-1",
            "name": "Sim - prazo de autorregulação ANBIMA",
            "type": "Autorregulação ANBIMA",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-e2c-3-pol-2",
            "name": "Sim - prazo contratual com parceiros",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% atualizações no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Tempo de equivalência",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Muito Crítico: 1, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ANBIMA Edu",
          "Sistema de faturamento/pagamento (voucher e boleto)",
          "ANBIMA Edu (formulário de dispensa)",
          "SSM"
        ],
        "painPoints": [
          "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Procedimento não documentado ou só informal em OP-193, OP-194",
          "Impactos/penalidades declarados: Inativação/cancelamento indevido da certificação",
          "Risco de contestação por parte de…",
          "Quebra contratual com parceiro de equivalência",
          "Dependência de terceiros: Parceiros de equivalência - CFA Institute, CAIA Association, EFPA - são contrapartes…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-e2c-3-1",
            "name": "Gerir Ciclo de Vida do Certificado",
            "code": "E2C.3.1",
            "description": "Atualiza, concede por equivalência e mantém a base de certificados.",
            "objective": "Atualiza, concede por equivalência e mantém a base de certificados.",
            "valueProposition": "Garantir que a pessoa certificada mantenha conhecimentos técnicos, regulatórios e… / Reconhecer certificações equivalentes de outras instituições, dispensando a realização…",
            "scopeBoundary": "Atividades L4: Atualizar certificações; Conceder certificação por equivalência; Manter base de profissionais certificados . Macroprocessos AS-IS: OP-193, OP-194.",
            "inputs": "Anexo 1 do Edital (Atualização das Certificações Anbima), Orientações e Informações…; Acordos de equivalência (CFA, CAIA, EIP/EFPA), Orientações e Informações Técnicas para… Fornecedores: Área interna; A entrada ocorre por meio da solicitação dos profissionais via Cognito. Quem fornece…",
            "outputs": "Certificação atualizada/ativa; ou inativação (até 3 anos) ou vencimento definitivo da…; Certificação concedida por equivalência; ou indeferimento fundamentado do pedido.",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-e2c-3-1-pol-1",
                "name": "Sim - prazo de autorregulação ANBIMA",
                "type": "Autorregulação ANBIMA",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-e2c-3-1-pol-2",
                "name": "Sim - prazo contratual com parceiros",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Contínuo (tempo real), Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Edu",
              "Sistema de faturamento/pagamento (voucher e boleto)",
              "ANBIMA Edu (formulário de dispensa)",
              "SSM"
            ],
            "painPoints": [
              "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-193, OP-194",
              "Impactos/penalidades declarados: Inativação/cancelamento indevido da certificação",
              "Risco de contestação por parte de…",
              "Quebra contratual com parceiro de equivalência",
              "Dependência de terceiros: Parceiros de equivalência - CFA Institute, CAIA Association, EFPA - são contrapartes…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-193, OP-194"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-3-1-1",
                "name": "Atualizar certificações",
                "code": "E2C.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-193, OP-194).",
                "scopeBoundary": "Atividade do L3 E2C.3.1 Gerir Ciclo de Vida do Certificado.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-3-1-2",
                "name": "Conceder certificação por equivalência",
                "code": "E2C.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-193, OP-194).",
                "scopeBoundary": "Atividade do L3 E2C.3.1 Gerir Ciclo de Vida do Certificado.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-3-1-3",
                "name": "Manter base de profissionais certificados",
                "code": "E2C.3.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 E2C.3.1 Gerir Ciclo de Vida do Certificado.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-e2c-4",
        "name": "Promover Educação",
        "code": "E2C.4",
        "description": "Promover educação continuada e financeira.",
        "objective": "Promover educação continuada e financeira.",
        "valueProposition": "Aprimoramento contínuo dos profissionais e da sociedade.",
        "scopeBoundary": "Compreende os L3: E2C.4.1 Gerir Educação Continuada; E2C.4.2 Promover Educação Financeira. Insere-se no L1 E2C e se limita às atividades descritas nesses L3.",
        "inputs": "Programas Detalhados das certificações; matriz curricular/de competências e critérios…; Catálogo e conteúdos dos cursos; base de alunos matriculados; registros de acesso,… Fornecedores: Rede Anbima de Educação, fóruns de mercado, banca técnica de especialistas; Insumos de entrada fornecidos por mercado em geral; Insumos de entrada sao fornecidos por instituicoes parceiras e fornecedor de LMS.",
        "outputs": "Jornadas, trilhas e microcertificações publicadas; badges/microcertificações de conclusão; Certificado de conclusão do curso livre.",
        "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
        "responsible": "Educação",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Concluintes de cursos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Alcance dos programas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 2, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ANBIMA Edu",
          "Anbima Edu BKO",
          "LMS Happmobi",
          "Como Investir"
        ],
        "painPoints": [
          "1 de 3 macroprocessos classificados como Crítico/Muito Crítico",
          "Procedimento não documentado ou só informal em OP-198, OP-200",
          "Dependência de terceiros: Sim - Happmobi, fornecedora do LMS que hospeda os cursos livres",
          "Sim - Happmobi (plataforma/LMS)"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-e2c-4-1",
            "name": "Gerir Educação Continuada",
            "code": "E2C.4.1",
            "description": "Gerencia conteúdos, jornadas e cursos livres.",
            "objective": "Gerencia conteúdos, jornadas e cursos livres.",
            "valueProposition": "Produzir, atualizar e disponibilizar conteúdo educacional (jornadas e trilhas de… / Disponibilizar conteúdo gratuito e atualizado sobre temas do mercado financeiro para…",
            "scopeBoundary": "Atividades L4: Gerir conteúdo e jornadas ANBIMA Edu; Gerir cursos livres. Macroprocessos AS-IS: OP-198, OP-200.",
            "inputs": "Programas Detalhados das certificações; matriz curricular/de competências e critérios…; Catálogo e conteúdos dos cursos; base de alunos matriculados; registros de acesso,… Fornecedores: Rede Anbima de Educação, fóruns de mercado, banca técnica de especialistas; Insumos de entrada fornecidos por mercado em geral.",
            "outputs": "Jornadas, trilhas e microcertificações publicadas; badges/microcertificações de conclusão; Certificado de conclusão do curso livre.",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Contínuo (tempo real)",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Edu",
              "Anbima Edu BKO",
              "LMS Happmobi"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-198, OP-200",
              "Dependência de terceiros: Sim - Happmobi, fornecedora do LMS que hospeda os cursos livres"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-198, OP-200"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-4-1-1",
                "name": "Gerir conteúdo e jornadas ANBIMA Edu",
                "code": "E2C.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-198, OP-200).",
                "scopeBoundary": "Atividade do L3 E2C.4.1 Gerir Educação Continuada.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-4-1-2",
                "name": "Gerir cursos livres",
                "code": "E2C.4.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-198, OP-200).",
                "scopeBoundary": "Atividade do L3 E2C.4.1 Gerir Educação Continuada.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-e2c-4-2",
            "name": "Promover Educação Financeira",
            "code": "E2C.4.2",
            "description": "Executa programas de educação financeira para jovens e universitários.",
            "objective": "Executa programas de educação financeira para jovens e universitários.",
            "valueProposition": "Promover educação financeira e autonomia para tomada de decisão consciente por meio de…",
            "scopeBoundary": "Atividades L4: Executar programa Como Investir em Você. Macroprocessos AS-IS: OP-199.",
            "inputs": "Calendário e regras de cada ciclo semestral; mailings e tokens de acesso; conteúdo e… Fornecedores: Insumos de entrada sao fornecidos por instituicoes parceiras e fornecedor de LMS.",
            "outputs": "Certificado digital de conclusão, com carga horária correspondente à jornada realizada…",
            "stakeholders": "Áreas executoras: Educação. Destinos: Mercado em geral.",
            "responsible": "Educação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Semestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Como Investir"
            ],
            "painPoints": [
              "Dependência de terceiros: Sim - Happmobi (plataforma/LMS)"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-199"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-4-2-1",
                "name": "Executar programa Como Investir em Você",
                "code": "E2C.4.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-199).",
                "scopeBoundary": "Atividade do L3 E2C.4.2 Promover Educação Financeira.",
                "responsible": "Educação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-e2c-5",
        "name": "Atender Candidatos e Certificados",
        "code": "E2C.5",
        "description": "Atender candidatos, certificados e instituições.",
        "objective": "Atender candidatos, certificados e instituições.",
        "valueProposition": "Experiência fluida na jornada de certificação.",
        "scopeBoundary": "Compreende os L3: E2C.5.1 Atender e Suportar Usuários de Educação. Insere-se no L1 E2C e se limita às atividades descritas nesses L3.",
        "inputs": "Edital, central de ajuda da plataforma e manual de RH para instituições; o que está no ticket. Fornecedores: Área interna.",
        "outputs": "Continuidade da jornada no ANBIMA Edu e atualização/alteração dos dados cadastrais,…; resolução das solicitações relacionados aos certificados.",
        "stakeholders": "Áreas executoras: Relacionamento, Tecnologia, Atendimento, Soluções Digitais I. Destinos: Áreas internas.",
        "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-e2c-5-pol-1",
            "name": "SLA imediato para continuidade do atendimento",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-e2c-5-pol-2",
            "name": "Zendesk: 5 dias para resolução das…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-e2c-5-pol-3",
            "name": "5 dias úteis para resposta",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "SLA de resposta",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "NPS",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 1, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ANBIMA Edu",
          "Anbima Edu BKO",
          "Jira"
        ],
        "painPoints": [
          "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-100)",
          "Procedimento não documentado ou só informal em OP-183",
          "Impactos/penalidades declarados: Impacto na experiência do público e na reputação da ANBIMA",
          "Não existe"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-e2c-5-1",
            "name": "Atender e Suportar Usuários de Educação",
            "code": "E2C.5.1",
            "description": "Resolve demandas e ocorrências de candidatos, certificados e instituições.",
            "objective": "Resolve demandas e ocorrências de candidatos, certificados e instituições.",
            "valueProposition": "Garantir a continuidade da jornada no ANBIMA Edu, apoiando usuários na autogestão e… / Suporte aos Atendimentos das Certificações.",
            "scopeBoundary": "Atividades L4: Atender demandas do ANBIMA Edu; Suportar ocorrências técnicas do ANBIMA Edu. Macroprocessos AS-IS: OP-183, OP-100.",
            "inputs": "Edital, central de ajuda da plataforma e manual de RH para instituições; o que está no ticket. Fornecedores: Área interna.",
            "outputs": "Continuidade da jornada no ANBIMA Edu e atualização/alteração dos dados cadastrais,…; resolução das solicitações relacionados aos certificados.",
            "stakeholders": "Áreas executoras: Relacionamento, Tecnologia, Atendimento, Soluções Digitais I. Destinos: Áreas internas.",
            "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-e2c-5-1-pol-1",
                "name": "SLA imediato para continuidade do atendimento",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-e2c-5-1-pol-2",
                "name": "Zendesk: 5 dias para resolução das…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-e2c-5-1-pol-3",
                "name": "5 dias úteis para resposta",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Contínuo (tempo real)",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ANBIMA Edu",
              "Anbima Edu BKO",
              "Jira"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-100)",
              "Procedimento não documentado ou só informal em OP-183",
              "Impactos/penalidades declarados: Impacto na experiência do público e na reputação da ANBIMA",
              "Não existe",
              "Dependência de terceiros: Parceiros FGV/Cesgranrio",
              "Rox"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-183, OP-100"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-e2c-5-1-1",
                "name": "Atender demandas do ANBIMA Edu",
                "code": "E2C.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-183, OP-100).",
                "scopeBoundary": "Atividade do L3 E2C.5.1 Atender e Suportar Usuários de Educação.",
                "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-e2c-5-1-2",
                "name": "Suportar ocorrências técnicas do ANBIMA Edu",
                "code": "E2C.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-183, OP-100).",
                "scopeBoundary": "Atividade do L3 E2C.5.1 Atender e Suportar Usuários de Educação.",
                "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-i2i",
    "name": "Desenvolvimento de Mercado",
    "code": "I2I",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Promover educação, sustentabilidade e inovação no mercado por meio de estudos, redes, jornadas e projetos que antecipem tendências e desenvolvam o ecossistema.",
    "objective": "Promover educação, sustentabilidade e inovação no mercado por meio de estudos, redes, jornadas e projetos que antecipem tendências e desenvolvam o ecossistema.",
    "valueProposition": "Posicionar a ANBIMA como catalisadora da evolução do mercado, gerando conhecimento e conexões que se convertam em novas práticas, produtos e agenda regulatória.",
    "scopeBoundary": "Inclui gestão de inovação para o mercado (estudos, testes de hipóteses, projetos), produção e curadoria de conhecimento em finanças sustentáveis e operação de redes de sustentabilidade e D&I. Consolidou os antigos L2 de inovação e de sustentabilidade/D&I.",
    "inputs": "Tendências tecnológicas e ESG; demandas dos associados; agenda estratégica (S2E); parcerias com consultorias e fornecedores; dados de mercado.",
    "outputs": "Estudos e relatórios; projetos e pilotos de inovação; conteúdos de finanças sustentáveis; jornadas, redes e eventos; insumos para autorregulação (R2E) e representação (I2A).",
    "stakeholders": "Inovação; Sustentabilidade; Comunicação; consultorias e agências. Destinos: associados, mercado, áreas internas (I2A, R2E, E2C).",
    "responsible": "Inovação, Sustentabilidade",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-i2i-pol-1",
        "name": "Compromissos públicos e contratos com fornecedores",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-i2i-pol-2",
        "name": "guias ANBIMA de sustentabilidade",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-i2i-pol-3",
        "name": "política de D&I",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Nº de projetos/pilotos concluídos",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Participantes das redes",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Alcance de conteúdos",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Iniciativas convertidas em regra ou produto",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Microsoft Copilot",
      "Microsoft Forms",
      "Brevo",
      "Miro",
      "Notion",
      "Canva",
      "Fluig",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: SharePoint/Teams para gestão de projetos e redes",
      "TO-BE: ferramenta de gestão de projetos (ClickUp/Jira)",
      "TO-BE: Brevo para comunicação de redes",
      "TO-BE: Microsoft Forms/Copilot para pesquisas e síntese"
    ],
    "painPoints": [
      "Uso de WhatsApp e ferramentas informais",
      "Dependência de fornecedores por projeto",
      "Dificuldade de medir impacto",
      "Prazos contratuais de eventos"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-i2i-1",
        "name": "Promover Educação, Sustentabilidade e Inovação",
        "code": "I2I.1",
        "description": "Promover educação, sustentabilidade e inovação no mercado (L2 consolidado).",
        "objective": "Promover educação, sustentabilidade e inovação no mercado (L2 consolidado).",
        "valueProposition": "Mercado mais inovador, sustentável e diverso, com a ANBIMA como catalisadora.",
        "scopeBoundary": "Compreende os L3: I2I.1.1 Gerir Inovação para o Mercado; I2I.1.2 Produzir Conhecimento em Finanças Sustentáveis; I2I.1.3 Gerir Redes de Sustentabilidade e D&I. Insere-se no L1 I2I e se limita às atividades descritas nesses L3.",
        "inputs": "Não é possível dimencionar, pois a cada projeto os documentos mudam; Planos de projeto, apresentações, pesquisas, atas, materiais de fornecedores, dados de… Fornecedores: Fornecedor/prestador externo; Área interna; Reguladores e áreas internas; Participantes da Rede, instituições associadas, áreas internas da ANBIMA e parceiros.",
        "outputs": "Fortalecimento da tomada de decisão, ampliação da capacidade de inovação da ANBIMA e…; Encontros, workshops, grupos temáticos, comunicações e conteúdos para a comunidade de…",
        "stakeholders": "Áreas executoras: Inovação, Sustentabilidade. Destinos: Áreas internas; Mercado em geral; Participantes da Rede (principal), áreas internas e mercado em geral; Áreas internas (principal), instituições participantes e mercado em geral; Reguladores e associados.",
        "responsible": "Inovação, Sustentabilidade",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-i2i-1-pol-1",
            "name": "Não há prazo regulatório, contratual ou de autorregulação fixo",
            "type": "Autorregulação ANBIMA",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-i2i-1-pol-2",
            "name": "os prazos são…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-i2i-1-pol-3",
            "name": "Sim - compromisso público divulgado",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-i2i-1-pol-4",
            "name": "Sim - prazo contratual com fornecedor de comunicação",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-i2i-1-pol-5",
            "name": "Sim - prazo contratual com fornecedores responsáveis pelo evento",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Projetos concluídos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Participantes das redes",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Conteúdos publicados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 3, Muito Crítico: 2, Baixo: 1, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Microsoft Excel",
          "Microsoft Outlook",
          "Microsoft SharePoint",
          "Microsoft Copilot",
          "WhatsApp",
          "Microsoft Teams",
          "Microsoft Forms",
          "Microsoft PowerPoint"
        ],
        "painPoints": [
          "5 de 7 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-190, OP-191, OP-184, OP-186, OP-187)",
          "Dependência de pessoa-chave em OP-190, OP-191, OP-188",
          "Procedimento não documentado ou só informal em OP-189, OP-188"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-i2i-1-1",
            "name": "Gerir Inovação para o Mercado",
            "code": "I2I.1.1",
            "description": "Conduz estudos, testes de hipóteses, redes e projetos estratégicos de inovação.",
            "objective": "Conduz estudos, testes de hipóteses, redes e projetos estratégicos de inovação.",
            "valueProposition": "Atuar como ponte entre dados, conhecimento técnico e visão institucional,… / Planejar, coordenar e executar as atividades da comunidade de inovação da ANBIMA,… / Planejar, coordenar e acompanhar a execução de projetos estratégicos de inovação,…",
            "scopeBoundary": "Atividades L4: Construir projetos do estúdio de inovação; Gerir rede ANBIMA de inovação; Coordenar projetos estratégicos de inovação. Macroprocessos AS-IS: OP-189, OP-190, OP-191.",
            "inputs": "Não é possível dimencionar, pois a cada projeto os documentos mudam; Planos de projeto, apresentações, pesquisas, atas, materiais de fornecedores, dados de… Fornecedores: Reguladores e áreas internas; Participantes da Rede, instituições associadas, áreas internas da ANBIMA e parceiros; Áreas internas demandantes, liderança, instituições participantes e fornecedores.",
            "outputs": "Fortalecimento da tomada de decisão, ampliação da capacidade de inovação da ANBIMA e…; Encontros, workshops, grupos temáticos, comunicações e conteúdos para a comunidade de…",
            "stakeholders": "Áreas executoras: Inovação. Destinos: Áreas internas; Participantes da Rede (principal), áreas internas e mercado em geral; Áreas internas (principal), instituições participantes e mercado em geral.",
            "responsible": "Inovação",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-i2i-1-1-pol-1",
                "name": "Não há prazo regulatório, contratual ou de autorregulação fixo",
                "type": "Autorregulação ANBIMA",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-i2i-1-1-pol-2",
                "name": "os prazos são…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-i2i-1-1-pol-3",
                "name": "Sim - compromisso público divulgado",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Contínuo (tempo real)",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1, Crítico: 1, Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Microsoft Copilot",
              "Microsoft Excel",
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Microsoft Forms",
              "Microsoft PowerPoint",
              "Microsoft Teams"
            ],
            "painPoints": [
              "2 de 3 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-190, OP-191)",
              "Dependência de pessoa-chave em OP-190, OP-191",
              "Procedimento não documentado ou só informal em OP-189",
              "Uso de Excel em etapas operacionais (3 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Exposição pública / dano de imagem",
              "Dependência de terceiros: Varia de acordo com o projeto executado",
              "Fornecedores e consultorias contratados para execução dos projetos, indispensáveis…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-189, OP-190, OP-191"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2i-1-1-1",
                "name": "Construir projetos do estúdio de inovação",
                "code": "I2I.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                "scopeBoundary": "Atividade do L3 I2I.1.1 Gerir Inovação para o Mercado.",
                "responsible": "Inovação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2i-1-1-2",
                "name": "Gerir rede ANBIMA de inovação",
                "code": "I2I.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                "scopeBoundary": "Atividade do L3 I2I.1.1 Gerir Inovação para o Mercado.",
                "responsible": "Inovação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2i-1-1-3",
                "name": "Coordenar projetos estratégicos de inovação",
                "code": "I2I.1.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                "scopeBoundary": "Atividade do L3 I2I.1.1 Gerir Inovação para o Mercado.",
                "responsible": "Inovação",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-i2i-1-2",
            "name": "Produzir Conhecimento em Finanças Sustentáveis",
            "code": "I2I.1.2",
            "description": "Faz curadoria e disseminação de conteúdo sobre finanças sustentáveis.",
            "objective": "Faz curadoria e disseminação de conteúdo sobre finanças sustentáveis.",
            "valueProposition": "Selecionar e disseminar conteúdos relevantes por meio de newsletters para a Rede…",
            "scopeBoundary": "Atividades L4: Curar conteúdo de sustentabilidade e finanças sustentáveis. Macroprocessos AS-IS: OP-184.",
            "inputs": "Material jornalistico produzido por veículos de comunicação. Fornecedores: Fornecedor/prestador externo; Insumo produzido por agência de comunicação contratada.",
            "outputs": "Newsletter de notícias de sustentabilidade e finanças sustentáveis distribuída aos…",
            "stakeholders": "Áreas executoras: Sustentabilidade. Destinos: Mercado em geral.",
            "responsible": "Sustentabilidade",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-i2i-1-2-pol-1",
                "name": "Sim - prazo contratual com fornecedor de comunicação",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "WhatsApp"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-184)",
              "Impactos/penalidades declarados: Quebra contratual com fornecedor",
              "Dependência de terceiros: Agência de comunicação responsável"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-184"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2i-1-2-1",
                "name": "Curar conteúdo de sustentabilidade e finanças sustentáveis",
                "code": "I2I.1.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-184).",
                "scopeBoundary": "Atividade do L3 I2I.1.2 Produzir Conhecimento em Finanças Sustentáveis.",
                "responsible": "Sustentabilidade",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-i2i-1-3",
            "name": "Gerir Redes de Sustentabilidade e D&I",
            "code": "I2I.1.3",
            "description": "Opera redes, jornadas, diálogos e eventos com o mercado.",
            "objective": "Opera redes, jornadas, diálogos e eventos com o mercado.",
            "valueProposition": "Engajar e capacitar o mercado de capitais na temática de sustentabilidade e D&I / Engajar e capacitar o mercado de capitais na temática de D&I / Fortalecimento da marca, capacitação e disseminação de conteúdos técnicos relacionados…",
            "scopeBoundary": "Atividades L4: Realizar eventos presenciais das redes; Conduzir Diálogos da rede de D&I; Conduzir Jornadas da rede de sustentabilidade. Macroprocessos AS-IS: OP-186, OP-187, OP-188.",
            "inputs": "Mailing no brevo e contrato com fornecedores; Mailing no brevo. Fornecedores: Área interna; Reguladores e associados.",
            "outputs": "Conclusão do evento e materiais produzidos; Workshops, vídeos, e-books e guias técnicos.",
            "stakeholders": "Áreas executoras: Sustentabilidade. Destinos: Mercado em geral; Reguladores e associados.",
            "responsible": "Sustentabilidade",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-i2i-1-3-pol-1",
                "name": "Sim - prazo contratual com fornecedores responsáveis pelo evento",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-i2i-1-3-pol-2",
                "name": "Sim - prazos contratuais compromisso com cronograma previamente informados",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Trimestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 2, Muito Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Brevo",
              "Fluig",
              "Microsoft Excel",
              "Microsoft Outlook",
              "Microsoft SharePoint",
              "Microsoft Teams",
              "WhatsApp"
            ],
            "painPoints": [
              "3 de 3 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-186, OP-187)",
              "Dependência de pessoa-chave em OP-188",
              "Procedimento não documentado ou só informal em OP-188",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Quebra contratual com fornecedor",
              "Quebra contratual com consultores",
              "Dependência de terceiros: Fornecedores responsáveis pela realização do evento (buffet, fotógrafo, recepção,…; Sim, responsável pelo conteúdo do evento"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-186, OP-187, OP-188"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-i2i-1-3-1",
                "name": "Realizar eventos presenciais das redes",
                "code": "I2I.1.3.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                "scopeBoundary": "Atividade do L3 I2I.1.3 Gerir Redes de Sustentabilidade e D&I.",
                "responsible": "Sustentabilidade",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2i-1-3-2",
                "name": "Conduzir Diálogos da rede de D&I",
                "code": "I2I.1.3.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                "scopeBoundary": "Atividade do L3 I2I.1.3 Gerir Redes de Sustentabilidade e D&I.",
                "responsible": "Sustentabilidade",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-i2i-1-3-3",
                "name": "Conduzir Jornadas da rede de sustentabilidade",
                "code": "I2I.1.3.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                "scopeBoundary": "Atividade do L3 I2I.1.3 Gerir Redes de Sustentabilidade e D&I.",
                "responsible": "Sustentabilidade",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-m2c",
    "name": "Associados e profissionais certificados",
    "code": "M2C",
    "domain": "Processo Finalístico",
    "category": "PRIMARY",
    "description": "Engajar associados e mercado, prestar serviços ao associado e converter contribuições, taxas e produtos em receita faturada e recebida.",
    "objective": "Engajar associados e mercado, prestar serviços ao associado e converter contribuições, taxas e produtos em receita faturada e recebida.",
    "valueProposition": "Garantir sustentabilidade financeira da associação e uma experiência consistente ao associado, do relacionamento ao recebimento.",
    "scopeBoundary": "Inclui marca e comunicação externa, eventos, proposta de valor ao associado, atendimento, ANBIMA Saúde, apuração de receitas, faturamento e recebimento/cobrança. Não inclui contabilização (R2R) nem pagamentos (S2P).",
    "inputs": "Cadastro de associados (R2E); bases de cálculo de taxas (C2P, R2E); tabela de preços e contribuições; contratos de produtos de dados e educação; demandas de clientes.",
    "outputs": "Campanhas, comunicados e eventos; atendimentos resolvidos; plano de saúde operado; valores apurados; faturas, notas e boletos; recebimentos conciliados e cobranças.",
    "stakeholders": "Comunicação & Marketing; Relacionamento; Finanças; Gente (Saúde); Tecnologia; Supervisão (taxas). Destinos: associados, clientes de produtos, imprensa, Bradesco/HealthBit, R2R.",
    "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI, Relacionamento, Finanças, Atendimento, Gestão de Contratos, Gente Saúde e D&I, Jurídico, Supervisão de Mercados, Business Analytics, Soluções Corporativas, Faturamento, Soluções Digitais I, Contas a Receber",
    "businessUnit": "Processos Finalísticos",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 88,
    "policies": [
      {
        "id": "anb-l1-m2c-pol-1",
        "name": "Tabela de contribuições e taxas",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-m2c-pol-2",
        "name": "contratos de produtos",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-m2c-pol-3",
        "name": "legislação fiscal de faturamento",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-m2c-pol-4",
        "name": "regulamento do ANBIMA Saúde / ANS",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Inadimplência (%)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Prazo de faturamento (até 5º dia útil)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "NPS do associado",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "SLA Zendesk (5 dias)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Receita por linha",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Sistemas de Controladoria - Protheus",
      "Open Metadata",
      "SSO",
      "Jira",
      "Fluig",
      "Portal de Documentos (PDTec / PDSign)",
      "ClickUp",
      "WebTran - Bradesco",
      "Hub ANBIMA",
      "Brevo",
      "Comunique-se",
      "Divulgacoes.anbima",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Protheus como ERP de faturamento e recebíveis",
      "TO-BE: Hub ANBIMA/SSO para dados de produtos",
      "TO-BE: Zendesk + 55PBX para atendimento",
      "TO-BE: Brevo/Comunique-se para comunicação",
      "TO-BE: CRM do associado (lacuna — sugerido) para proposta de valor"
    ],
    "painPoints": [
      "Muitos faturamentos manuais e dependentes de cálculos externos",
      "Ausência de visão única do associado (CRM)",
      "Conciliação com múltiplos bancos",
      "Proposta de valor ao associado não estruturada"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-m2c-1",
        "name": "Engajar Associados e Profissionais certificados",
        "code": "M2C.1",
        "description": "Engajar associados e mercado via marca, comunicação, eventos e proposta de valor.",
        "objective": "Engajar associados e mercado via marca, comunicação, eventos e proposta de valor.",
        "valueProposition": "Associação relevante e visível, com associados engajados.",
        "scopeBoundary": "Compreende os L3: M2C.1.1 Gerir Marca e Comunicação Externa; M2C.1.2 Realizar Eventos; M2C.1.3 Gerir Proposta de Valor ao Associado. Insere-se no L1 M2C e se limita às atividades descritas nesses L3.",
        "inputs": "Guias de boas práticas da ANBIMA, notas técnicas, boletins de fundos, boletim de…; Boletins de fundos, MK, private e varejo, Raio-x do investidor, conteúdos de… Fornecedores: Área interna; jornalistas.",
        "outputs": "Atendimento à demanda da imprensa, fornecimento de informações e dados e/ou realização…; Divulgação de dados do mercado, realização de lives para esclarecimento de temas e…",
        "stakeholders": "Áreas executoras: Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI. Destinos: Imprensa; Áreas internas; Imprensa, associados, mercado em geral e demais públicos externos; Área interna e convidados.",
        "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 67,
        "policies": [
          {
            "id": "anb-l2-m2c-1-pol-1",
            "name": "Sim, de acordo com os contratos com fornecedores os orgãos",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "NPS",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Participantes em eventos",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Menções na imprensa",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 4",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Microsoft Outlook",
          "Microsoft Teams",
          "Brevo",
          "Comunique-se",
          "Divulgacoes.anbima",
          "Open Metadata",
          "StreamYard",
          "WhatsApp"
        ],
        "painPoints": [
          "Dependência de pessoa-chave em OP-181",
          "Procedimento não documentado ou só informal em OP-179, OP-180",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Impactos/penalidades declarados: Multa"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-m2c-1-1",
            "name": "Gerir Marca e Comunicação Externa",
            "code": "M2C.1.1",
            "description": "Relaciona-se com imprensa e comunica a associados e ao mercado.",
            "objective": "Relaciona-se com imprensa e comunica a associados e ao mercado.",
            "valueProposition": "Atender demandas da imprensa, fornecendo informações, dados e acesso a porta-vozes da… / Comunicar e disponibilizar informações da ANBIMA a associados, imprensa e demais…",
            "scopeBoundary": "Atividades L4: Atender a imprensa; Comunicar e divulgar informações ao público externo. Macroprocessos AS-IS: OP-179, OP-180.",
            "inputs": "Guias de boas práticas da ANBIMA, notas técnicas, boletins de fundos, boletim de…; Boletins de fundos, MK, private e varejo, Raio-x do investidor, conteúdos de… Fornecedores: Área interna; jornalistas.",
            "outputs": "Atendimento à demanda da imprensa, fornecimento de informações e dados e/ou realização…; Divulgação de dados do mercado, realização de lives para esclarecimento de temas e…",
            "stakeholders": "Áreas executoras: Comunicação & Marketing. Destinos: Imprensa; Imprensa, associados, mercado em geral e demais públicos externos.",
            "responsible": "Comunicação & Marketing",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Outlook",
              "Brevo",
              "Comunique-se",
              "Divulgacoes.anbima",
              "Microsoft Teams",
              "Open Metadata",
              "StreamYard"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-179, OP-180"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-179, OP-180"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-1-1-1",
                "name": "Atender a imprensa",
                "code": "M2C.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-179, OP-180).",
                "scopeBoundary": "Atividade do L3 M2C.1.1 Gerir Marca e Comunicação Externa.",
                "responsible": "Comunicação & Marketing",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-1-1-2",
                "name": "Comunicar e divulgar informações ao público externo",
                "code": "M2C.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-179, OP-180).",
                "scopeBoundary": "Atividade do L3 M2C.1.1 Gerir Marca e Comunicação Externa.",
                "responsible": "Comunicação & Marketing",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-m2c-1-2",
            "name": "Realizar Eventos",
            "code": "M2C.1.2",
            "description": "Planeja e executa eventos institucionais.",
            "objective": "Planeja e executa eventos institucionais.",
            "valueProposition": "Planejar e executar eventos internos e externos, garantindo sua organização e… / Planejamento, coordenação e suporte operacional necessários para a realização dos…",
            "scopeBoundary": "Atividades L4: Planejar e executar eventos; Suportar tecnicamente eventos institucionais. Macroprocessos AS-IS: OP-181, OP-095.",
            "inputs": "Briefing; Briefing do evento, lista de convidados, lista de fornecedores, cronograma, reserva de… Fornecedores: Área interna.",
            "outputs": "Eventos realizado; Evento realizado com infraestrutura, recursos tecnológicos e suporte operacional…",
            "stakeholders": "Áreas executoras: Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI. Destinos: Áreas internas; Área interna e convidados.",
            "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-m2c-1-2-pol-1",
                "name": "Sim, de acordo com os contratos com fornecedores os orgãos",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Microsoft Outlook",
              "Microsoft Excel",
              "Microsoft PowerPoint",
              "Microsoft Word",
              "Jira",
              "Microsoft Teams",
              "Sistema de Reserva de Salas"
            ],
            "painPoints": [
              "Dependência de pessoa-chave em OP-181",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Multa",
              "Dependência de terceiros: Fornecedores de eventos, transmissão e apoio operacional"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-181, OP-095"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-1-2-1",
                "name": "Planejar e executar eventos",
                "code": "M2C.1.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-181, OP-095).",
                "scopeBoundary": "Atividade do L3 M2C.1.2 Realizar Eventos.",
                "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-1-2-2",
                "name": "Suportar tecnicamente eventos institucionais",
                "code": "M2C.1.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-181, OP-095).",
                "scopeBoundary": "Atividade do L3 M2C.1.2 Realizar Eventos.",
                "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-m2c-1-3",
            "name": "Gerir Proposta de Valor ao Associado",
            "code": "M2C.1.3",
            "description": "Segmenta associados, mede satisfação e evolui a oferta.",
            "objective": "Segmenta associados, mede satisfação e evolui a oferta.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 M2C.1 Engajar Associados e Mercado.",
            "scopeBoundary": "Atividades L4 propostas: Segmentar associados e definir proposta de valor ; Medir satisfação e engajamento de associados .",
            "inputs": "Diretrizes estratégicas e normativas do L1 M2C; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 M2C.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-m2c-1-3-pol-1",
                "name": "Política de associação",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-m2c-1-3-pol-2",
                "name": "tabela de contribuições",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "CRM do associado (lacuna — ex.: Dynamics/Salesforce) (sugerido)",
              "Microsoft Forms ou Brevo para pesquisas (sugerido)",
              "Power BI (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-1-3-1",
                "name": "Segmentar associados e definir proposta de valor",
                "code": "M2C.1.3.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 M2C.1.3 Gerir Proposta de Valor ao Associado.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-1-3-2",
                "name": "Medir satisfação e engajamento de associados",
                "code": "M2C.1.3.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 M2C.1.3 Gerir Proposta de Valor ao Associado.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-m2c-2",
        "name": "Atender e relacionar",
        "code": "M2C.2",
        "description": "Atender e relacionar-se com associados e mercado.",
        "objective": "Atender e relacionar-se com associados e mercado.",
        "valueProposition": "Respostas rápidas e consistentes.",
        "scopeBoundary": "Compreende os L3: M2C.2.1 Atender Associados e Mercado. Insere-se no L1 M2C e se limita às atividades descritas nesses L3.",
        "inputs": "Edital e base de processos para consulta no Zendesk (Guide); Informações do negócio; Certidões; Ata e Estatuto Social; Procuração; Políticas e… Fornecedores: Área interna.",
        "outputs": "Resolução da demanda solicitada; Questionário respondido, documentos comprobatórios e retorno formal ao cliente/parceiro.",
        "stakeholders": "Áreas executoras: Relacionamento, Finanças, Atendimento, Gestão de Contratos. Destinos: Destinatários podem incluir clientes, associados, aderentes, clientes do plano de…",
        "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-m2c-2-pol-1",
            "name": "Zendesk: SLA de 5 dias",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-m2c-2-pol-2",
            "name": "voz: atendimento imediato",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "SLA Zendesk",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Taxa de resolução no 1º contato",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "55PBX",
          "Zendesk",
          "Fluig",
          "Jira",
          "Netlex",
          "Portal de Documentos (PDTec / PDSign)"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-182, OP-012",
          "Impactos/penalidades declarados: Impacto na experiência do público que nos aciona",
          "Dependência de terceiros: Zendesk e 55PBX"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-m2c-2-1",
            "name": "Atender Associados e Mercado",
            "code": "M2C.2.1",
            "description": "Resolve dúvidas e responde diligências de clientes.",
            "objective": "Resolve dúvidas e responde diligências de clientes.",
            "valueProposition": "Esclarecimento e resolução de dúvidas relacionadas ao processo de certificação / Atender às solicitações de diligência recebidas de clientes e parceiros,…",
            "scopeBoundary": "Atividades L4: Atender e resolver dúvidas; Responder diligências de clientes e terceiros. Macroprocessos AS-IS: OP-182, OP-012.",
            "inputs": "Edital e base de processos para consulta no Zendesk (Guide); Informações do negócio; Certidões; Ata e Estatuto Social; Procuração; Políticas e… Fornecedores: Área interna.",
            "outputs": "Resolução da demanda solicitada; Questionário respondido, documentos comprobatórios e retorno formal ao cliente/parceiro.",
            "stakeholders": "Áreas executoras: Relacionamento, Finanças, Atendimento, Gestão de Contratos. Destinos: Destinatários podem incluir clientes, associados, aderentes, clientes do plano de…",
            "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-m2c-2-1-pol-1",
                "name": "Zendesk: SLA de 5 dias",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-m2c-2-1-pol-2",
                "name": "voz: atendimento imediato",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "55PBX",
              "Zendesk",
              "Fluig",
              "Jira",
              "Netlex",
              "Portal de Documentos (PDTec / PDSign)"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-182, OP-012",
              "Impactos/penalidades declarados: Impacto na experiência do público que nos aciona",
              "Dependência de terceiros: Zendesk e 55PBX"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-182, OP-012"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-2-1-1",
                "name": "Atender e resolver dúvidas",
                "code": "M2C.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-182, OP-012).",
                "scopeBoundary": "Atividade do L3 M2C.2.1 Atender Associados e Mercado.",
                "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-2-1-2",
                "name": "Responder diligências de clientes e terceiros",
                "code": "M2C.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-182, OP-012).",
                "scopeBoundary": "Atividade do L3 M2C.2.1 Atender Associados e Mercado.",
                "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-m2c-3",
        "name": "Prestar Serviços ao Associado",
        "code": "M2C.3",
        "description": "Prestar serviços ao associado, como o ANBIMA Saúde.",
        "objective": "Prestar serviços ao associado, como o ANBIMA Saúde.",
        "valueProposition": "Benefícios tangíveis que aumentam a retenção de associados.",
        "scopeBoundary": "Compreende os L3: M2C.3.1 Operar ANBIMA Saúde. Insere-se no L1 M2C e se limita às atividades descritas nesses L3.",
        "inputs": "Documentos societários e de FGTS das empresas, carta de solicitação de adesão,…; documentos. Fornecedores: Instituições participantes; Área interna; Fornecedor/prestador externo.",
        "outputs": "Inclusão da empresa e seus beneficiários no plano de saúde; documento analisado.",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Jurídico. Destinos: Áreas internas; Fornecedores/prestadores; Jurídico ANBIMA recebe os documentos para análise e as empresas contratantes que são…; Empresas dos mercados financeiros/capitais contratantes do nosso plano de saúde,…",
        "responsible": "Gente Saúde e D&I, Jurídico",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Vidas ativas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Reclamações",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Prazos de movimentação",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 3, Moderado: 1, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "ClickUp",
          "Pipefy",
          "Portal de Documentos (PDTec / PDSign)",
          "Sisplan",
          "Conversor Bradesco",
          "Microsoft Excel",
          "Microsoft Outlook",
          "SSBE - Bradesco"
        ],
        "painPoints": [
          "1 de 5 macroprocessos classificados como Crítico/Muito Crítico",
          "Procedimento não documentado ou só informal em OP-047, OP-090, OP-048, OP-045, OP-046",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
          "Dependência de terceiros: Bradesco, para disponibilizar o arquivo das vidas em TXT",
          "HealthBit que recebe as informações das empresas, e a Bradesco, para disponibilizar o…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-m2c-3-1",
            "name": "Operar ANBIMA Saúde",
            "code": "M2C.3.1",
            "description": "Implanta e opera o plano de saúde oferecido às instituições associadas.",
            "objective": "Implanta e opera o plano de saúde oferecido às instituições associadas.",
            "valueProposition": "Analisar e cadastrar as empresas que querem contratar o plano de saúde / Assegurar a conformidade jurídica dos documentos e mitigar riscos legais para a ANBIMA / Dar o acesso ao portal financeiro para as empresas contratantes do plano de saúde.",
            "scopeBoundary": "Atividades L4: Implantar plano de saúde para empresa associada; Analisar documentação jurídica de adesão ao plano; Cadastrar empresas no SISPLAN; Enviar base a prestadores parceiros; Atualizar portal de movimentações. Macroprocessos AS-IS: OP-047, OP-090, OP-048, OP-045, OP-046.",
            "inputs": "Documentos societários e de FGTS das empresas, carta de solicitação de adesão,…; documentos. Fornecedores: Instituições participantes; Área interna; Fornecedor/prestador externo.",
            "outputs": "Inclusão da empresa e seus beneficiários no plano de saúde; documento analisado.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Jurídico. Destinos: Áreas internas; Fornecedores/prestadores; Jurídico ANBIMA recebe os documentos para análise e as empresas contratantes que são…; Empresas dos mercados financeiros/capitais contratantes do nosso plano de saúde,…",
            "responsible": "Gente Saúde e D&I, Jurídico",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Diário, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 3, Moderado: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "ClickUp",
              "Pipefy",
              "Portal de Documentos (PDTec / PDSign)",
              "Sisplan",
              "Conversor Bradesco",
              "Microsoft Excel",
              "Microsoft Outlook"
            ],
            "painPoints": [
              "1 de 5 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-047, OP-090, OP-048, OP-045, OP-046",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Dependência de terceiros: Bradesco, para disponibilizar o arquivo das vidas em TXT",
              "HealthBit que recebe as informações das empresas, e a Bradesco, para disponibilizar o…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-047, OP-090, OP-048, OP-045, OP-046"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-3-1-1",
                "name": "Implantar plano de saúde para empresa associada",
                "code": "M2C.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                "scopeBoundary": "Atividade do L3 M2C.3.1 Operar ANBIMA Saúde.",
                "responsible": "Gente Saúde e D&I, Jurídico",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-3-1-2",
                "name": "Analisar documentação jurídica de adesão ao plano",
                "code": "M2C.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                "scopeBoundary": "Atividade do L3 M2C.3.1 Operar ANBIMA Saúde.",
                "responsible": "Gente Saúde e D&I, Jurídico",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-3-1-3",
                "name": "Cadastrar empresas no SISPLAN",
                "code": "M2C.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                "scopeBoundary": "Atividade do L3 M2C.3.1 Operar ANBIMA Saúde.",
                "responsible": "Gente Saúde e D&I, Jurídico",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-3-1-4",
                "name": "Enviar base a prestadores parceiros",
                "code": "M2C.3.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                "scopeBoundary": "Atividade do L3 M2C.3.1 Operar ANBIMA Saúde.",
                "responsible": "Gente Saúde e D&I, Jurídico",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-3-1-5",
                "name": "Atualizar portal de movimentações",
                "code": "M2C.3.1.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                "scopeBoundary": "Atividade do L3 M2C.3.1 Operar ANBIMA Saúde.",
                "responsible": "Gente Saúde e D&I, Jurídico",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-m2c-4",
        "name": "Apurar e faturar receitas",
        "code": "M2C.4",
        "description": "Apurar e faturar contribuições, taxas, produtos e serviços.",
        "objective": "Apurar e faturar contribuições, taxas, produtos e serviços.",
        "valueProposition": "Receita completa, correta e tempestiva.",
        "scopeBoundary": "Compreende os L3: M2C.4.1 Apurar Receitas; M2C.4.2 Faturar Produtos e Taxas. Insere-se no L1 M2C e se limita às atividades descritas nesses L3.",
        "inputs": "Base SSM, Dados públicos banco central e Ranking de Prestadores de Serviço (ANBIMA); Parâmetros da execução. Fornecedores: Área interna; Instituições participantes; Fornecedor/prestador externo.",
        "outputs": "Cobrança de taxas de Supervisão; Relatório analítico da execução, Notas Fiscais, Boletos, E-mails para os…",
        "stakeholders": "Áreas executoras: Supervisão de Mercados, Tecnologia, Finanças, Gente Saúde e D&I, Business Analytics, Soluções Corporativas. Destinos: Áreas internas; Mercado em geral; Associados; Associados - Empresas dos mercados financeiros/capitais contratantes do nosso plano de…",
        "responsible": "Supervisão de Mercados, Tecnologia, Finanças, Gente Saúde e D&I, Business Analytics, Soluções Corporativas",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-m2c-4-pol-1",
            "name": "Até o 5º dia útil do mês par",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-m2c-4-pol-2",
            "name": "3 dias úteis para resposta",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Faturamento até o 5º dia útil",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% refaturamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 11, Baixo: 2, Crítico: 2",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Sistemas de Controladoria - Protheus",
          "Open Metadata",
          "SSO",
          "Hub ANBIMA",
          "Databricks",
          "Dataiku",
          "Sistemas de Controladoria - Taxa bimestral (Taxa Bim)",
          "ANBIMA Edu"
        ],
        "painPoints": [
          "2 de 15 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 6 macroprocesso(s) (OP-104, OP-024, OP-023, OP-026, OP-101, OP-103)",
          "Dependência de pessoa-chave em OP-104",
          "Procedimento não documentado ou só informal em OP-219, OP-017, OP-021, OP-022, OP-025, OP-020, OP-018, OP-019, OP-044"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-m2c-4-1",
            "name": "Apurar Receitas",
            "code": "M2C.4.1",
            "description": "Calcula taxas e valores a faturar.",
            "objective": "Calcula taxas e valores a faturar.",
            "valueProposition": "Calcular e encaminhar ao financeiro o cálculo das taxas para cada participante de cada… / Suporte ao Faturamento da Taxa Bimestral de Fundos.",
            "scopeBoundary": "Atividades L4: Apurar taxas de supervisão; Apurar taxa de divulgação de fundos. Macroprocessos AS-IS: OP-219, OP-104.",
            "inputs": "Base SSM, Dados públicos banco central e Ranking de Prestadores de Serviço (ANBIMA); Parâmetros da execução. Fornecedores: Área interna.",
            "outputs": "Cobrança de taxas de Supervisão; Relatório analítico da execução, Notas Fiscais, Boletos, E-mails para os…",
            "stakeholders": "Áreas executoras: Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas. Destinos: Áreas internas; Mercado em geral.",
            "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-m2c-4-1-pol-1",
                "name": "Até o 5º dia útil do mês par",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal, Bimestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Sistemas de Controladoria - Protheus",
              "Databricks",
              "Dataiku",
              "Sistemas de Controladoria - Taxa bimestral (Taxa Bim)"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-104)",
              "Dependência de pessoa-chave em OP-104",
              "Procedimento não documentado ou só informal em OP-219",
              "Impactos/penalidades declarados: não existe",
              "Dependência de terceiros: Dataiku e Databricks",
              "GPMA (Fundos) e VHD Prime (Protheus)"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-219, OP-104"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-4-1-1",
                "name": "Apurar taxas de supervisão",
                "code": "M2C.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-219, OP-104).",
                "scopeBoundary": "Atividade do L3 M2C.4.1 Apurar Receitas.",
                "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-1-2",
                "name": "Apurar taxa de divulgação de fundos",
                "code": "M2C.4.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-219, OP-104).",
                "scopeBoundary": "Atividade do L3 M2C.4.1 Apurar Receitas.",
                "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-m2c-4-2",
            "name": "Faturar Produtos e Taxas",
            "code": "M2C.4.2",
            "description": "Emite faturamento de contribuições, taxas, produtos e serviços.",
            "objective": "Emite faturamento de contribuições, taxas, produtos e serviços.",
            "valueProposition": "Imputar informações dos clientes, produto, histórico e valores para que o faturamento… / Processo automatizado via HUB e SSO / Processo automatizado, utilizando apenas parametros no protheus.",
            "scopeBoundary": "Atividades L4: Faturar contribuição associativa; Faturar taxas de supervisão (anual e semestral) [OP-021; OP-022]; Faturar taxas de registro de fundos e ofertas públicas; Faturar taxa ANBIMA de fundos de investimento; Faturar multas; Faturar ANBIMA Feed; Faturar ETF; Faturar custos SELIC; Faturar ANBIMA Edu (B2C e B2B) [OP-026; OP-101]; Faturar plano de saúde; Emitir e transmitir notas fiscais de serviço. Macroprocessos AS-IS: OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103.",
            "inputs": "Balanço patrimonial - PL da instituição - ex: 2026 utilizamos o PL de 31/12/2025; Apuração feita pela área. Fornecedores: Área interna; Instituições participantes; Fornecedor/prestador externo.",
            "outputs": "Cobrança mensal; Cobrança anual.",
            "stakeholders": "Áreas executoras: Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I. Destinos: Associados; Áreas internas; Associados - Empresas dos mercados financeiros/capitais contratantes do nosso plano de…",
            "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-m2c-4-2-pol-1",
                "name": "3 dias úteis para resposta",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal, Anual, Semestral",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 11, Baixo: 1, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Open Metadata",
              "Sistemas de Controladoria - Protheus",
              "SSO",
              "Hub ANBIMA",
              "ANBIMA Edu",
              "SISPLAN",
              "WebTran - Bradesco"
            ],
            "painPoints": [
              "1 de 13 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 5 macroprocesso(s) (OP-024, OP-023, OP-026, OP-101, OP-103)",
              "Procedimento não documentado ou só informal em OP-017, OP-021, OP-022, OP-025, OP-020, OP-018, OP-019, OP-044",
              "Impactos/penalidades declarados: não existe",
              "Dependência de terceiros: Provedor do sistema (TOTVS)",
              "Provedor do sistema HUB, SSO e TOTVS"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-4-2-1",
                "name": "Faturar contribuição associativa",
                "code": "M2C.4.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-2",
                "name": "Faturar taxas de supervisão (anual e semestral)",
                "code": "M2C.4.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-021; OP-022).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-3",
                "name": "Faturar taxas de registro de fundos e ofertas públicas",
                "code": "M2C.4.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-4",
                "name": "Faturar taxa ANBIMA de fundos de investimento",
                "code": "M2C.4.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-5",
                "name": "Faturar multas",
                "code": "M2C.4.2.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-6",
                "name": "Faturar ANBIMA Feed",
                "code": "M2C.4.2.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-7",
                "name": "Faturar ETF",
                "code": "M2C.4.2.7",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-8",
                "name": "Faturar custos SELIC",
                "code": "M2C.4.2.8",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-9",
                "name": "Faturar ANBIMA Edu (B2C e B2B)",
                "code": "M2C.4.2.9",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-026; OP-101).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-10",
                "name": "Faturar plano de saúde",
                "code": "M2C.4.2.10",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-4-2-11",
                "name": "Emitir e transmitir notas fiscais de serviço",
                "code": "M2C.4.2.11",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                "scopeBoundary": "Atividade do L3 M2C.4.2 Faturar Produtos e Taxas.",
                "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-m2c-5",
        "name": "Receber e cobrar",
        "code": "M2C.5",
        "description": "Receber, conciliar e cobrar.",
        "objective": "Receber, conciliar e cobrar.",
        "valueProposition": "Caixa realizado e inadimplência controlada.",
        "scopeBoundary": "Compreende os L3: M2C.5.1 Gerir Recebimentos e Cobrança. Insere-se no L1 M2C e se limita às atividades descritas nesses L3.",
        "inputs": "CNAB e relatórios bancarios; Relatórios de repasses finaceiros (Arquivos excel). Fornecedores: Fornecedor/prestador externo.",
        "outputs": "Posição de contas a receber; Realização das baixas financeiras.",
        "stakeholders": "Áreas executoras: Finanças, Contas a Receber. Destinos: Áreas internas; Clientes/fornecedores/prestadores.",
        "responsible": "Finanças, Contas a Receber",
        "businessUnit": "Processos Finalísticos",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Inadimplência",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Prazo médio de recebimento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 3, Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Sistemas de Controladoria - Protheus",
          "Banco do Bradesco",
          "Itaú",
          "Adyen",
          "Fluig",
          "RPA"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 4 macroprocesso(s) (OP-031, OP-032, OP-033, OP-034)",
          "Dependência de terceiros: Provedor do sistema (TOTVS)",
          "Provedor do sistema (TOTVS) Adyen"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-m2c-5-1",
            "name": "Gerir Recebimentos e Cobrança",
            "code": "M2C.5.1",
            "description": "Concilia recebimentos, trata devoluções e cobra inadimplentes.",
            "objective": "Concilia recebimentos, trata devoluções e cobra inadimplentes.",
            "valueProposition": "Gerir a identificação, solicitação, aprovação e processamento de devoluções de… / Gerir a cobrança de clientes inadimplentes, automatizando e acompanhando as…",
            "scopeBoundary": "Atividades L4: Gerir e conciliar recebimentos B2B; Gerir e conciliar recebimentos B2C; Gerir devoluções de pagamentos; Gerir cobrança e inadimplência. Macroprocessos AS-IS: OP-031, OP-032, OP-033, OP-034.",
            "inputs": "CNAB e relatórios bancarios; Relatórios de repasses finaceiros (Arquivos excel). Fornecedores: Fornecedor/prestador externo.",
            "outputs": "Posição de contas a receber; Realização das baixas financeiras.",
            "stakeholders": "Áreas executoras: Finanças, Contas a Receber. Destinos: Áreas internas; Clientes/fornecedores/prestadores.",
            "responsible": "Finanças, Contas a Receber",
            "businessUnit": "Processos Finalísticos",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 3, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Sistemas de Controladoria - Protheus",
              "Banco do Bradesco",
              "Itaú",
              "Adyen",
              "Fluig",
              "RPA"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 4 macroprocesso(s) (OP-031, OP-032, OP-033, OP-034)",
              "Dependência de terceiros: Provedor do sistema (TOTVS)",
              "Provedor do sistema (TOTVS) Adyen"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-031, OP-032, OP-033, OP-034"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-m2c-5-1-1",
                "name": "Gerir e conciliar recebimentos B2B",
                "code": "M2C.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                "scopeBoundary": "Atividade do L3 M2C.5.1 Gerir Recebimentos e Cobrança.",
                "responsible": "Finanças, Contas a Receber",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-5-1-2",
                "name": "Gerir e conciliar recebimentos B2C",
                "code": "M2C.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                "scopeBoundary": "Atividade do L3 M2C.5.1 Gerir Recebimentos e Cobrança.",
                "responsible": "Finanças, Contas a Receber",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-5-1-3",
                "name": "Gerir devoluções de pagamentos",
                "code": "M2C.5.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                "scopeBoundary": "Atividade do L3 M2C.5.1 Gerir Recebimentos e Cobrança.",
                "responsible": "Finanças, Contas a Receber",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-m2c-5-1-4",
                "name": "Gerir cobrança e inadimplência",
                "code": "M2C.5.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                "scopeBoundary": "Atividade do L3 M2C.5.1 Gerir Recebimentos e Cobrança.",
                "responsible": "Finanças, Contas a Receber",
                "businessUnit": "Processos Finalísticos",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-h2r",
    "name": "Contratar a Desligar",
    "code": "H2R",
    "domain": "Processo de Suporte",
    "category": "SUPPORT",
    "description": "Planejar, atrair, desenvolver, remunerar e administrar a força de trabalho e fortalecer a cultura da ANBIMA.",
    "objective": "Planejar, atrair, desenvolver, remunerar e administrar a força de trabalho e fortalecer a cultura da ANBIMA.",
    "valueProposition": "Ter as pessoas certas, engajadas e bem administradas para executar a estratégia, com conformidade trabalhista.",
    "scopeBoundary": "Do planejamento de quadro ao desligamento: recrutamento, admissão, desenvolvimento, remuneração, benefícios, folha e jornada, cultura e engajamento.",
    "inputs": "Plano estratégico e orçamento; requisições de vagas; legislação trabalhista; avaliações de desempenho; dados de ponto.",
    "outputs": "Quadro aprovado; admissões; trilhas e avaliações; política de cargos e salários; benefícios; folha e obrigações (eSocial, FGTS); ações de cultura.",
    "stakeholders": "Gente, Saúde e D&I; gestores; Finanças; fornecedores (Gupy, Biz, TOTVS). Destinos: colaboradores, governo, R2R.",
    "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
    "businessUnit": "Processos de Suporte",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-h2r-pol-1",
        "name": "CLT",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-h2r-pol-2",
        "name": "eSocial",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-h2r-pol-3",
        "name": "convenção coletiva",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-h2r-pol-4",
        "name": "políticas internas de RH",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Turnover",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Tempo de contratação",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Horas de treinamento/colaborador",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Erros de folha",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "ENPS",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Sistema de RH - RM",
      "E-SOCIAL",
      "Pipefy",
      "Biz",
      "Plano",
      "Gupy",
      "LinkedIn",
      "GUPY",
      "WALLJOBS",
      "Brevo",
      "Canva",
      "Unico Skill",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: TOTVS RM como core de RH",
      "TO-BE: Gupy para recrutamento",
      "TO-BE: Unico Skill/ImpulseUp para desenvolvimento",
      "TO-BE: Biz para remuneração/benefícios",
      "TO-BE: Workvivo para comunicação interna",
      "TO-BE: eSocial/FGTS Digital"
    ],
    "painPoints": [
      "Várias ferramentas pontuais (Pipefy, Biz, Gupy) pouco integradas ao RM",
      "Prazos legais de folha",
      "Dependência de suporte TOTVS"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-h2r-1",
        "name": "Planejar Força de Trabalho",
        "code": "H2R.1",
        "description": "Planejar a força de trabalho e seu custo.",
        "objective": "Planejar a força de trabalho e seu custo.",
        "valueProposition": "Quadro dimensionado à estratégia e ao orçamento.",
        "scopeBoundary": "Compreende os L3: H2R.1.1 Planejar Quadro e Custo de Pessoal. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "Sql by RM Labora, Relatório Focus/Bacen. Fornecedores: CEO, FP&A, SELIC/BACEN, HEAD DE RH.",
        "outputs": "Base Orçamentária da Anbima, arquivo de importação para FP&A.",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Áreas internas.",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Realizado vs. orçado de pessoal",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Plano",
          "Sistema de RH - RM"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-053"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-1-1",
            "name": "Planejar Quadro e Custo de Pessoal",
            "code": "H2R.1.1",
            "description": "Planeja quadro, estrutura e orçamento de pessoal.",
            "objective": "Planeja quadro, estrutura e orçamento de pessoal.",
            "valueProposition": "Elaborar o orçamento anual de despesas com pessoal da ANBIMA, contemplando os…",
            "scopeBoundary": "Atividades L4: Elaborar orçamento de pessoal; Desenhar e manter estrutura organizacional . Macroprocessos AS-IS: OP-053.",
            "inputs": "Sql by RM Labora, Relatório Focus/Bacen. Fornecedores: CEO, FP&A, SELIC/BACEN, HEAD DE RH.",
            "outputs": "Base Orçamentária da Anbima, arquivo de importação para FP&A.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Áreas internas.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Plano",
              "Sistema de RH - RM"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-053"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-053"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-1-1-1",
                "name": "Elaborar orçamento de pessoal",
                "code": "H2R.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-053).",
                "scopeBoundary": "Atividade do L3 H2R.1.1 Planejar Quadro e Custo de Pessoal.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-1-1-2",
                "name": "Desenhar e manter estrutura organizacional",
                "code": "H2R.1.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 H2R.1.1 Planejar Quadro e Custo de Pessoal.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-h2r-2",
        "name": "Recrutar e Integrar",
        "code": "H2R.2",
        "description": "Recrutar, selecionar e integrar colaboradores.",
        "objective": "Recrutar, selecionar e integrar colaboradores.",
        "valueProposition": "Talentos certos admitidos com rapidez e conformidade.",
        "scopeBoundary": "Compreende os L3: H2R.2.1 Atrair e Admitir. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "Dados da vaga e proposta e informações profissionais dos candidatos; Dados da vaga e proposta; documentos pessoais; exame admissional; cadastro Gupy;… Fornecedores: Área interna; Recrutamento e Seleção, candidato, gestor e fornecedores.",
        "outputs": "Relatório vagas e detalhes extraidos da plataforma Gupy / Controle Planilha Vagas; Colaborador admitido e ativo; contrato/documentos assinados; cadastro no RM Labore;…",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Área/líderes que solicitaram, TI, Compliance; Colaborador, gestor, Folha, Benefícios, TI/SI e eSocial.",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-h2r-2-pol-1",
            "name": "Sim - prazo regulatório (norma/lei)",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Tempo de contratação",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Retenção 90 dias",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1, Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Gupy",
          "LinkedIn",
          "Microsoft Outlook",
          "WhatsApp",
          "E-SOCIAL",
          "GUPY",
          "Sistema de RH - RM",
          "WALLJOBS"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-054, OP-049",
          "Impactos/penalidades declarados: Multa financeira",
          "Dependência de terceiros: Gupy, WallJobs, clínicas de exame ocupacional e suporte TOTVS, conforme o tipo de…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-2-1",
            "name": "Atrair e Admitir",
            "code": "H2R.2.1",
            "description": "Recruta, seleciona e admite colaboradores.",
            "objective": "Recruta, seleciona e admite colaboradores.",
            "valueProposition": "Conduzir os processos seletivos para preenchimento de vagas por substituição ou… / Formalizar a entrada do colaborador, garantindo cadastro, documentos, acessos e envio…",
            "scopeBoundary": "Atividades L4: Conduzir processo seletivo; Admitir colaboradores. Macroprocessos AS-IS: OP-054, OP-049.",
            "inputs": "Dados da vaga e proposta e informações profissionais dos candidatos; Dados da vaga e proposta; documentos pessoais; exame admissional; cadastro Gupy;… Fornecedores: Área interna; Recrutamento e Seleção, candidato, gestor e fornecedores.",
            "outputs": "Relatório vagas e detalhes extraidos da plataforma Gupy / Controle Planilha Vagas; Colaborador admitido e ativo; contrato/documentos assinados; cadastro no RM Labore;…",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Área/líderes que solicitaram, TI, Compliance; Colaborador, gestor, Folha, Benefícios, TI/SI e eSocial.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-h2r-2-1-pol-1",
                "name": "Sim - prazo regulatório (norma/lei)",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Gupy",
              "LinkedIn",
              "Microsoft Outlook",
              "WhatsApp",
              "E-SOCIAL",
              "GUPY",
              "Sistema de RH - RM"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-054, OP-049",
              "Impactos/penalidades declarados: Multa financeira",
              "Dependência de terceiros: Gupy, WallJobs, clínicas de exame ocupacional e suporte TOTVS, conforme o tipo de…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-054, OP-049"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-2-1-1",
                "name": "Conduzir processo seletivo",
                "code": "H2R.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-054, OP-049).",
                "scopeBoundary": "Atividade do L3 H2R.2.1 Atrair e Admitir.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-2-1-2",
                "name": "Admitir colaboradores",
                "code": "H2R.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-054, OP-049).",
                "scopeBoundary": "Atividade do L3 H2R.2.1 Atrair e Admitir.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-h2r-3",
        "name": "Desenvolver e Crescer",
        "code": "H2R.3",
        "description": "Desenvolver e avaliar colaboradores.",
        "objective": "Desenvolver e avaliar colaboradores.",
        "valueProposition": "Capacidades críticas fortalecidas e sucessão planejada.",
        "scopeBoundary": "Compreende os L3: H2R.3.1 Desenvolver Colaboradores. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "Apenas dados de identificação do colaborador para inscrição nos curso/plataforma. Fornecedores: Área interna.",
        "outputs": "Acesso a curso/plataforma para o colaborador; Avaliação e desempenho, promoção, desligamento, bônus para todos.",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores.",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Horas de treinamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% avaliações concluídas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 2",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Brevo",
          "Canva",
          "Pipefy",
          "Unico Skill",
          "ImpulseUp"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-061, OP-064",
          "Dependência de terceiros: Pipefy, Unico skill",
          "ImpulseUp"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-3-1",
            "name": "Desenvolver Colaboradores",
            "code": "H2R.3.1",
            "description": "Capacita, avalia desempenho e planeja sucessão.",
            "objective": "Capacita, avalia desempenho e planeja sucessão.",
            "valueProposition": "Levantamento de necessidades de desenvolvimento; Planejamento do calendário de… / Avaliar o desempenho de cada funcionário, conforme as metas acordadas com o gestor.",
            "scopeBoundary": "Atividades L4: Gerir treinamento e desenvolvimento; Gerir desempenho; Desenvolver plano de sucessão . Macroprocessos AS-IS: OP-061, OP-064.",
            "inputs": "Apenas dados de identificação do colaborador para inscrição nos curso/plataforma. Fornecedores: Área interna.",
            "outputs": "Acesso a curso/plataforma para o colaborador; Avaliação e desempenho, promoção, desligamento, bônus para todos.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Anual",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Brevo",
              "Canva",
              "Pipefy",
              "Unico Skill",
              "ImpulseUp"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-061, OP-064",
              "Dependência de terceiros: Pipefy, Unico skill",
              "ImpulseUp"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-061, OP-064"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-3-1-1",
                "name": "Gerir treinamento e desenvolvimento",
                "code": "H2R.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-061, OP-064).",
                "scopeBoundary": "Atividade do L3 H2R.3.1 Desenvolver Colaboradores.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-3-1-2",
                "name": "Gerir desempenho",
                "code": "H2R.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-061, OP-064).",
                "scopeBoundary": "Atividade do L3 H2R.3.1 Desenvolver Colaboradores.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-3-1-3",
                "name": "Desenvolver plano de sucessão",
                "code": "H2R.3.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 H2R.3.1 Desenvolver Colaboradores.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-h2r-4",
        "name": "Recompensar e Reter",
        "code": "H2R.4",
        "description": "Remunerar, gerir benefícios e reter.",
        "objective": "Remunerar, gerir benefícios e reter.",
        "valueProposition": "Pacote competitivo e retenção de talentos.",
        "scopeBoundary": "Compreende os L3: H2R.4.1 Gerir Remuneração; H2R.4.2 Operar Benefícios. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "Gupy, e-mail da Kioma; Gupy, Controle de utilização do vale transporte, Plataforma da Biz. Fornecedores: Área interna.",
        "outputs": "Premiação; Vale Transporte.",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores; Fornecedores/prestadores.",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Turnover voluntário",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Posicionamento salarial",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 5",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Biz",
          "Alelo",
          "Banco do Bradesco"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-056, OP-055, OP-058, OP-057, OP-060",
          "Dependência de terceiros: BIZ",
          "Alelo, Suporte Totvs"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-4-1",
            "name": "Gerir Remuneração",
            "code": "H2R.4.1",
            "description": "Mantém cargos, salários e incentivos.",
            "objective": "Mantém cargos, salários e incentivos.",
            "valueProposition": "Processar o pagamento das premiações do programa Indique um Talento, assegurando a…",
            "scopeBoundary": "Atividades L4: Gerir arquitetura de cargos e salários ; Pagar premiações e incentivos. Macroprocessos AS-IS: OP-056.",
            "inputs": "Gupy, e-mail da Kioma. Fornecedores: Área interna.",
            "outputs": "Premiação.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Biz"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-056",
              "Dependência de terceiros: BIZ"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-056"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-4-1-1",
                "name": "Gerir arquitetura de cargos e salários",
                "code": "H2R.4.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 H2R.4.1 Gerir Remuneração.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-4-1-2",
                "name": "Pagar premiações e incentivos",
                "code": "H2R.4.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-056).",
                "scopeBoundary": "Atividade do L3 H2R.4.1 Gerir Remuneração.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-h2r-4-2",
            "name": "Operar Benefícios",
            "code": "H2R.4.2",
            "description": "Administra benefícios aos colaboradores.",
            "objective": "Administra benefícios aos colaboradores.",
            "valueProposition": "Calcular e operacionalizar a concessão e o pagamento do vale-transporte aos… / Operacionalizar a concessão dos benefícios de vale-alimentação e vale-refeição… / Administrar o benefício de seguro de vida dos colaboradores, assegurando o pagamento…",
            "scopeBoundary": "Atividades L4: Gerir vale-transporte; Gerir vale-alimentação e refeição; Gerir seguro de vida; Gerir previdência privada. Macroprocessos AS-IS: OP-055, OP-058, OP-057, OP-060.",
            "inputs": "Gupy, Controle de utilização do vale transporte, Plataforma da Biz; Base RM labore. Fornecedores: Área interna.",
            "outputs": "Vale Transporte; Pagamento do benefício de VA/VR para todos os funcionários, conforme previsto na CCT.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores; Fornecedores/prestadores.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Biz",
              "Alelo",
              "Banco do Bradesco"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-055, OP-058, OP-057, OP-060",
              "Dependência de terceiros: BIZ",
              "Alelo, Suporte Totvs"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-055, OP-058, OP-057, OP-060"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-4-2-1",
                "name": "Gerir vale-transporte",
                "code": "H2R.4.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                "scopeBoundary": "Atividade do L3 H2R.4.2 Operar Benefícios.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-4-2-2",
                "name": "Gerir vale-alimentação e refeição",
                "code": "H2R.4.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                "scopeBoundary": "Atividade do L3 H2R.4.2 Operar Benefícios.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-4-2-3",
                "name": "Gerir seguro de vida",
                "code": "H2R.4.2.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                "scopeBoundary": "Atividade do L3 H2R.4.2 Operar Benefícios.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-4-2-4",
                "name": "Gerir previdência privada",
                "code": "H2R.4.2.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                "scopeBoundary": "Atividade do L3 H2R.4.2 Operar Benefícios.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-h2r-5",
        "name": "Administrar Pessoal",
        "code": "H2R.5",
        "description": "Administrar ponto, folha e obrigações trabalhistas.",
        "objective": "Administrar ponto, folha e obrigações trabalhistas.",
        "valueProposition": "Pagamento correto e conformidade legal.",
        "scopeBoundary": "Compreende os L3: H2R.5.1 Processar Folha e Jornada. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "Cadastros do RM Labore; lançamentos mensais; ponto; planilhas de conferência; Solicitação aprovada; cadastro e histórico no RM Labore; período aquisitivo; médias;… Fornecedores: Área interna; Gestor, colaborador e áreas de apoio.",
        "outputs": "Pagamento e desconto de todas as horas apuradas mensalmente; Férias calculadas e pagas; recibo emitido; programação registrada; reflexos na folha e…",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores; Colaborador, gestor, Folha e Financeiro. Validar se a contingência está documentada e…; Todos os colaboradores, Financeiro, Contabilidade e obrigações governamentais.…; Ex-colaborador, Financeiro, Contabilidade, TI/SI, Benefícios e governo. Validar…",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-h2r-5-pol-1",
            "name": "Sim - prazo regulatório (norma/lei)",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Erros de folha",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Eventos eSocial no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 3, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Sistema de RH - RM",
          "E-SOCIAL",
          "Pipefy",
          "Itaú",
          "EMPREGADOR WEB",
          "FGTS DIGITAL"
        ],
        "painPoints": [
          "1 de 4 macroprocessos classificados como Crítico/Muito Crítico",
          "Procedimento não documentado ou só informal em OP-059, OP-050, OP-052, OP-051",
          "Impactos/penalidades declarados: Multa financeira",
          "Dependência de terceiros: Suporte TOTVS",
          "Suporte TOTVS, quando houver indisponibilidade ou erro sistêmico"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-5-1",
            "name": "Processar Folha e Jornada",
            "code": "H2R.5.1",
            "description": "Processa ponto, férias, folha e rescisões.",
            "objective": "Processa ponto, férias, folha e rescisões.",
            "valueProposition": "Calcular, conferir, aprovar e processar o pagamento do ponto, garantindo o correto… / Programar, calcular, pagar e registrar férias conforme solicitações aprovadas e prazos… / Calcular, conferir, aprovar, pagar e contabilizar a folha, assegurando encargos,…",
            "scopeBoundary": "Atividades L4: Processar e fechar o ponto; Gerir férias; Processar e fechar folha de pagamento; Processar rescisões. Macroprocessos AS-IS: OP-059, OP-050, OP-052, OP-051.",
            "inputs": "Cadastros do RM Labore; lançamentos mensais; ponto; planilhas de conferência; Solicitação aprovada; cadastro e histórico no RM Labore; período aquisitivo; médias;… Fornecedores: Área interna; Gestor, colaborador e áreas de apoio.",
            "outputs": "Pagamento e desconto de todas as horas apuradas mensalmente; Férias calculadas e pagas; recibo emitido; programação registrada; reflexos na folha e…",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores; Colaborador, gestor, Folha e Financeiro. Validar se a contingência está documentada e…; Todos os colaboradores, Financeiro, Contabilidade e obrigações governamentais.…; Ex-colaborador, Financeiro, Contabilidade, TI/SI, Benefícios e governo. Validar…",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-h2r-5-1-pol-1",
                "name": "Sim - prazo regulatório (norma/lei)",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 3, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Sistema de RH - RM",
              "E-SOCIAL",
              "Pipefy",
              "Itaú",
              "EMPREGADOR WEB",
              "FGTS DIGITAL"
            ],
            "painPoints": [
              "1 de 4 macroprocessos classificados como Crítico/Muito Crítico",
              "Procedimento não documentado ou só informal em OP-059, OP-050, OP-052, OP-051",
              "Impactos/penalidades declarados: Multa financeira",
              "Dependência de terceiros: Suporte TOTVS",
              "Suporte TOTVS, quando houver indisponibilidade ou erro sistêmico"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-059, OP-050, OP-052, OP-051"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-5-1-1",
                "name": "Processar e fechar o ponto",
                "code": "H2R.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                "scopeBoundary": "Atividade do L3 H2R.5.1 Processar Folha e Jornada.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-5-1-2",
                "name": "Gerir férias",
                "code": "H2R.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                "scopeBoundary": "Atividade do L3 H2R.5.1 Processar Folha e Jornada.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-5-1-3",
                "name": "Processar e fechar folha de pagamento",
                "code": "H2R.5.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                "scopeBoundary": "Atividade do L3 H2R.5.1 Processar Folha e Jornada.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-5-1-4",
                "name": "Processar rescisões",
                "code": "H2R.5.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                "scopeBoundary": "Atividade do L3 H2R.5.1 Processar Folha e Jornada.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-h2r-6",
        "name": "Gerir Cultura e Engajamento",
        "code": "H2R.6",
        "description": "Gerir cultura, comunicação interna e engajamento.",
        "objective": "Gerir cultura, comunicação interna e engajamento.",
        "valueProposition": "Colaboradores engajados e cultura alinhada.",
        "scopeBoundary": "Compreende os L3: H2R.6.1 Fortalecer Cultura e Engajamento. Insere-se no L1 H2R e se limita às atividades descritas nesses L3.",
        "inputs": "—. Fornecedores: Área interna.",
        "outputs": "Publicações de comunicação interna e ações para diversos canais.",
        "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores.",
        "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "ENPS",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Engajamento Workvivo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 2",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Microsoft Outlook",
          "Workvivo"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-062, OP-063",
          "Dependência de terceiros: Workvivo, Outlook"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-h2r-6-1",
            "name": "Fortalecer Cultura e Engajamento",
            "code": "H2R.6.1",
            "description": "Comunica internamente e promove cultura, diversidade e inclusão.",
            "objective": "Comunica internamente e promove cultura, diversidade e inclusão.",
            "valueProposition": "Planejamento de comunicação interna; Produção e divulgação de comunicados internos;… / Planejamento da agenda de Diversidade e Inclusão; Gestão de indicadores de…",
            "scopeBoundary": "Atividades L4: Gerir comunicação interna e endomarketing; Gerir cultura, diversidade e inclusão. Macroprocessos AS-IS: OP-062, OP-063.",
            "inputs": "—. Fornecedores: Área interna.",
            "outputs": "Publicações de comunicação interna e ações para diversos canais.",
            "stakeholders": "Áreas executoras: Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos. Destinos: Colaboradores.",
            "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Semanal, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Microsoft Outlook",
              "Workvivo"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-062, OP-063",
              "Dependência de terceiros: Workvivo, Outlook"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-062, OP-063"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-h2r-6-1-1",
                "name": "Gerir comunicação interna e endomarketing",
                "code": "H2R.6.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-062, OP-063).",
                "scopeBoundary": "Atividade do L3 H2R.6.1 Fortalecer Cultura e Engajamento.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-h2r-6-1-2",
                "name": "Gerir cultura, diversidade e inclusão",
                "code": "H2R.6.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-062, OP-063).",
                "scopeBoundary": "Atividade do L3 H2R.6.1 Fortalecer Cultura e Engajamento.",
                "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-s2p",
    "name": "Suprir a Pagar",
    "code": "S2P",
    "domain": "Processo de Suporte",
    "category": "SUPPORT",
    "description": "Planejar compras, processar faturas e pagamentos e gerir viagens e despesas com controle e eficiência.",
    "objective": "Planejar compras, processar faturas e pagamentos e gerir viagens e despesas com controle e eficiência.",
    "valueProposition": "Garantir que a associação pague corretamente e no prazo, com gastos controlados e transparentes.",
    "scopeBoundary": "Inclui análise de gastos e estratégia de compras, contas a pagar e viagens/reembolsos. A etapa de cotação e contratação (antigo S2P.2) foi retirada do escopo TO-BE — ponto de atenção.",
    "inputs": "Orçamento (R2R); necessidades das áreas; documentos fiscais; contratos; solicitações de viagem.",
    "outputs": "Estratégia de categorias; pagamentos efetuados; viagens emitidas; prestações de conta e reembolsos.",
    "stakeholders": "Facilities; Finanças; Controladoria; áreas solicitantes; Flytour. Destinos: fornecedores, colaboradores, R2R.",
    "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos, Viagens",
    "businessUnit": "Processos de Suporte",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 67,
    "policies": [
      {
        "id": "anb-l1-s2p-pol-1",
        "name": "Política de compras e alçadas",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-s2p-pol-2",
        "name": "política de viagens e despesas",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-s2p-pol-3",
        "name": "legislação fiscal",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "% pagamentos no prazo",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Tempo de ciclo da fatura",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Savings",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Prazo de reembolso (15 dias)",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Fluig",
      "Sistemas de Controladoria - Protheus",
      "Itaú",
      "Zendesk",
      "Trello",
      "VExpenses",
      "Netlex",
      "Plano",
      "Banco do Bradesco",
      "Argo",
      "Ligaí",
      "VoeBiz",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Fluig como workflow de aprovação",
      "TO-BE: Protheus para contas a pagar",
      "TO-BE: VExpenses e Argo/Ligaí para viagens",
      "TO-BE: Itaú para pagamentos"
    ],
    "painPoints": [
      "Sem etapa de sourcing/contratação no TO-BE",
      "Análise de gastos é lacuna",
      "Muitas ferramentas de viagem (Argo, Ligaí, VoeBiz, Trello)"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-s2p-1",
        "name": "Planejar Compras",
        "code": "S2P.1",
        "description": "Planejar compras e definir estratégia por categoria.",
        "objective": "Planejar compras e definir estratégia por categoria.",
        "valueProposition": "Gastos otimizados e previsíveis.",
        "scopeBoundary": "Compreende os L3: S2P.1.1 Analisar Gastos e Definir Estratégia de Compras. Insere-se no L1 S2P e se limita às atividades descritas nesses L3.",
        "inputs": "Diretrizes do L1 S2P; ver detalhamento nos L3.",
        "outputs": "Analisa gastos e define categorias e estratégia de compras.",
        "stakeholders": "Área responsável a definir (sem macroprocesso AS-IS).",
        "responsible": "A definir",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "pending",
        "contextValidationPercent": 0,
        "policies": [
          {
            "id": "anb-l2-s2p-1-pol-1",
            "name": "Política de compras e alçadas",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Gasto sob gestão",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Savings",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          }
        ],
        "systems": [
          "Protheus (compras) + Power BI para spend analysis (sugerido)"
        ],
        "painPoints": [
          "L2 sem macroprocesso AS-IS — capacidade inexistente ou informal hoje",
          "Requer definição de dono, processo e ferramenta"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2p-1-1",
            "name": "Analisar Gastos e Definir Estratégia de Compras",
            "code": "S2P.1.1",
            "description": "Analisa gastos e define categorias e estratégia de compras.",
            "objective": "Analisa gastos e define categorias e estratégia de compras.",
            "valueProposition": "Institucionalizar uma capacidade hoje inexistente ou informal na ANBIMA, alinhada a boas práticas, reduzindo riscos e aumentando a previsibilidade do L2 S2P.1 Planejar Compras.",
            "scopeBoundary": "Atividades L4 propostas: Analisar perfil de gastos ; Definir estratégia de compras por categoria .",
            "inputs": "Diretrizes estratégicas e normativas do L1 S2P; dados e resultados dos demais L3 do mesmo L2.",
            "outputs": "Resultados das atividades L4 acima (planos, relatórios, decisões).",
            "stakeholders": "Dono a definir; destinos: Diretoria/governança e áreas executoras do L1 S2P.",
            "responsible": "Dono a definir",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "pending",
            "contextValidationPercent": 0,
            "policies": [
              {
                "id": "anb-l3-s2p-1-1-pol-1",
                "name": "Política de compras e alçadas",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "Cumprimento do plano/ciclo",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Prazo das entregas",
                "currentValue": "A definir",
                "target": "A definir",
                "status": "sem_dados"
              }
            ],
            "systems": [
              "Protheus (compras) + Power BI para spend analysis (sugerido)"
            ],
            "painPoints": [
              "Capacidade não mapeada no AS-IS",
              "Risco de ausência de dono, de critérios e de evidências para governança/reguladores"
            ],
            "evidences": [],
            "openQuestions": [
              "Lacuna TO-BE: capacidade sem macroprocesso AS-IS — conteúdo proposto (boa prática APQC/IOSCO)"
            ],
            "childrenL4": [
              {
                "id": "anb-l4-s2p-1-1-1",
                "name": "Analisar perfil de gastos",
                "code": "S2P.1.1.1",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2P.1.1 Analisar Gastos e Definir Estratégia de Compras.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-1-1-2",
                "name": "Definir estratégia de compras por categoria",
                "code": "S2P.1.1.2",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 S2P.1.1 Analisar Gastos e Definir Estratégia de Compras.",
                "responsible": "Dono a definir",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-s2p-2",
        "name": "Fatura a Pagamento",
        "code": "S2P.2",
        "description": "Processar faturas e pagamentos (fatura a pagamento).",
        "objective": "Processar faturas e pagamentos (fatura a pagamento).",
        "valueProposition": "Pagamentos corretos e no prazo.",
        "scopeBoundary": "Compreende os L3: S2P.2.1 Processar Contas a Pagar. Insere-se no L1 S2P e se limita às atividades descritas nesses L3.",
        "inputs": "Notas de fornecedores e contrato; Natureza orçamentária, centro de custo, forma de pagamento e data de vencimento. Fornecedores: Fornecedor/prestador externo; Área interna; Insumos têm origem na área contratante e no fornecedor.",
        "outputs": "Controle de pagamentos e contratos e garantir que os prazos sejam cumpridos; Documentos fiscais classificados e registrados corretamente para contabilização e…",
        "stakeholders": "Áreas executoras: Facilities, Finanças, Contas a Pagar, Gestão de Contratos. Destinos: Áreas internas; Fornecedores/prestadores.",
        "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-s2p-2-pol-1",
            "name": "Se o pagamento estiver vinculado a um contrato, pode ter prazo de pagamento",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "% no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Tempo de ciclo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4, Crítico: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Fluig",
          "Microsoft Excel",
          "Sistemas de Controladoria - Protheus",
          "Zendesk",
          "Itaú",
          "Microsoft Outlook",
          "Netlex",
          "Plano"
        ],
        "painPoints": [
          "1 de 5 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-008, OP-027, OP-015, OP-028, OP-030)",
          "Uso de Excel em etapas operacionais (3 macroprocesso(s)), com risco de erro manual",
          "Impactos/penalidades declarados: Multa e juros indicados em contrato / boleto"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2p-2-1",
            "name": "Processar Contas a Pagar",
            "code": "S2P.2.1",
            "description": "Valida documentos fiscais e processa pagamentos.",
            "objective": "Valida documentos fiscais e processa pagamentos.",
            "valueProposition": "Controlar o recebimento e o lançamento de notas fiscais, contratos e demais… / Classificar documentos fiscais e garantir a retenção de impostos, alocação… / Receber, conferir e encaminhar notas fiscais e demais documentos para aprovação e…",
            "scopeBoundary": "Atividades L4: Gerir notas fiscais e recebimentos de fornecedores; Classificar documentos fiscais; Validar e solicitar pagamento de contratos; Gerar borderô e incluir pagamentos no banco; Processar remessas de câmbio. Macroprocessos AS-IS: OP-008, OP-027, OP-015, OP-028, OP-030.",
            "inputs": "Notas de fornecedores e contrato; Natureza orçamentária, centro de custo, forma de pagamento e data de vencimento. Fornecedores: Fornecedor/prestador externo; Área interna; Insumos têm origem na área contratante e no fornecedor.",
            "outputs": "Controle de pagamentos e contratos e garantir que os prazos sejam cumpridos; Documentos fiscais classificados e registrados corretamente para contabilização e…",
            "stakeholders": "Áreas executoras: Facilities, Finanças, Contas a Pagar, Gestão de Contratos. Destinos: Áreas internas; Fornecedores/prestadores.",
            "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-s2p-2-1-pol-1",
                "name": "Se o pagamento estiver vinculado a um contrato, pode ter prazo de pagamento",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Várias vezes ao dia, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4, Crítico: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Fluig",
              "Microsoft Excel",
              "Sistemas de Controladoria - Protheus",
              "Zendesk",
              "Itaú",
              "Microsoft Outlook",
              "Netlex"
            ],
            "painPoints": [
              "1 de 5 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 5 macroprocesso(s) (OP-008, OP-027, OP-015, OP-028, OP-030)",
              "Uso de Excel em etapas operacionais (3 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Multa e juros indicados em contrato / boleto",
              "Dependência de terceiros: FLUIG / Protheus"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-008, OP-027, OP-015, OP-028, OP-030"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-s2p-2-1-1",
                "name": "Gerir notas fiscais e recebimentos de fornecedores",
                "code": "S2P.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                "scopeBoundary": "Atividade do L3 S2P.2.1 Processar Contas a Pagar.",
                "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-2-1-2",
                "name": "Classificar documentos fiscais",
                "code": "S2P.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                "scopeBoundary": "Atividade do L3 S2P.2.1 Processar Contas a Pagar.",
                "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-2-1-3",
                "name": "Validar e solicitar pagamento de contratos",
                "code": "S2P.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                "scopeBoundary": "Atividade do L3 S2P.2.1 Processar Contas a Pagar.",
                "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-2-1-4",
                "name": "Gerar borderô e incluir pagamentos no banco",
                "code": "S2P.2.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                "scopeBoundary": "Atividade do L3 S2P.2.1 Processar Contas a Pagar.",
                "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-2-1-5",
                "name": "Processar remessas de câmbio",
                "code": "S2P.2.1.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                "scopeBoundary": "Atividade do L3 S2P.2.1 Processar Contas a Pagar.",
                "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-s2p-3",
        "name": "Gerir Viagens e Despesas",
        "code": "S2P.3",
        "description": "Gerir viagens e despesas.",
        "objective": "Gerir viagens e despesas.",
        "valueProposition": "Viagens ágeis e despesas controladas.",
        "scopeBoundary": "Compreende os L3: S2P.3.1 Operar Viagens e Reembolsos. Insere-se no L1 S2P e se limita às atividades descritas nesses L3.",
        "inputs": "Sistema de Viagens / Sistema de Backoffice (Ligaí); Sistema de Backoffice (Ligaí) / Planilha de KPI de Viagens e informações Orçamentárias. Fornecedores: Área interna; Fornecedor/prestador externo.",
        "outputs": "Gestão da roteirização e da documentação de todas as viagens da Associação. Emissão de…; Evidências da realização da viagem e prestação de contas.",
        "stakeholders": "Áreas executoras: Facilities, Viagens. Destinos: Áreas internas.",
        "responsible": "Facilities, Viagens",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-s2p-3-pol-1",
            "name": "15 dias após a viagem",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-s2p-3-pol-2",
            "name": "Todos os meses de acordo com a competência",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Prazo de reembolso",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% em política",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Microsoft SharePoint",
          "Trello",
          "Fluig",
          "Sistemas de Controladoria - Protheus",
          "VExpenses",
          "Argo",
          "Ligaí",
          "VoeBiz"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-004)",
          "Dependência de pessoa-chave em OP-004",
          "Procedimento não documentado ou só informal em OP-002, OP-003, OP-010",
          "Dependência de terceiros: Flytour",
          "Vexpenses"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-s2p-3-1",
            "name": "Operar Viagens e Reembolsos",
            "code": "S2P.3.1",
            "description": "Emite serviços de viagem, gerencia prestação de contas e reembolsos.",
            "objective": "Emite serviços de viagem, gerencia prestação de contas e reembolsos.",
            "valueProposition": "Emitir todos os serviços necessários que compõe a viagem do colaborador / Analisar a prestação de contas de cada viagem realizada da Associação / Realizar a gestão do fechamento de todas as faturas pertinentes as compras dos…",
            "scopeBoundary": "Atividades L4: Emitir serviços de viagem; Gerir prestação de contas de viagens; Fechar faturas de agências e cartões; Gerir despesas corporativas e reembolsos. Macroprocessos AS-IS: OP-002, OP-003, OP-004, OP-010.",
            "inputs": "Sistema de Viagens / Sistema de Backoffice (Ligaí); Sistema de Backoffice (Ligaí) / Planilha de KPI de Viagens e informações Orçamentárias. Fornecedores: Área interna; Fornecedor/prestador externo.",
            "outputs": "Gestão da roteirização e da documentação de todas as viagens da Associação. Emissão de…; Evidências da realização da viagem e prestação de contas.",
            "stakeholders": "Áreas executoras: Facilities, Viagens. Destinos: Áreas internas.",
            "responsible": "Facilities, Viagens",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-s2p-3-1-pol-1",
                "name": "15 dias após a viagem",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-s2p-3-1-pol-2",
                "name": "Todos os meses de acordo com a competência",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia, Semanal, Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Microsoft SharePoint",
              "Trello",
              "Fluig",
              "Sistemas de Controladoria - Protheus",
              "VExpenses",
              "Argo",
              "Ligaí"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-004)",
              "Dependência de pessoa-chave em OP-004",
              "Procedimento não documentado ou só informal em OP-002, OP-003, OP-010",
              "Dependência de terceiros: Flytour",
              "Vexpenses"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-002, OP-003, OP-004, OP-010"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-s2p-3-1-1",
                "name": "Emitir serviços de viagem",
                "code": "S2P.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                "scopeBoundary": "Atividade do L3 S2P.3.1 Operar Viagens e Reembolsos.",
                "responsible": "Facilities, Viagens",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-3-1-2",
                "name": "Gerir prestação de contas de viagens",
                "code": "S2P.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                "scopeBoundary": "Atividade do L3 S2P.3.1 Operar Viagens e Reembolsos.",
                "responsible": "Facilities, Viagens",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-3-1-3",
                "name": "Fechar faturas de agências e cartões",
                "code": "S2P.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                "scopeBoundary": "Atividade do L3 S2P.3.1 Operar Viagens e Reembolsos.",
                "responsible": "Facilities, Viagens",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-s2p-3-1-4",
                "name": "Gerir despesas corporativas e reembolsos",
                "code": "S2P.3.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                "scopeBoundary": "Atividade do L3 S2P.3.1 Operar Viagens e Reembolsos.",
                "responsible": "Facilities, Viagens",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-r2r",
    "name": "Planejar a Reportar",
    "code": "R2R",
    "domain": "Processo de Suporte",
    "category": "SUPPORT",
    "description": "Planejar e acompanhar o orçamento, registrar e contabilizar transações, apurar tributos, fechar e reportar e gerir a tesouraria.",
    "objective": "Planejar e acompanhar o orçamento, registrar e contabilizar transações, apurar tributos, fechar e reportar e gerir a tesouraria.",
    "valueProposition": "Dar transparência e confiabilidade financeira à associação, atendendo fisco, auditoria e Conselho Fiscal.",
    "scopeBoundary": "Do orçamento anual à demonstração financeira auditada, incluindo tributos e gestão de caixa.",
    "inputs": "Estratégia (S2E); receitas (M2C); pagamentos (S2P); folha (H2R); extratos bancários; legislação tributária.",
    "outputs": "Orçamento e forecasts; lançamentos contábeis; obrigações acessórias; demonstrações auditadas; posição de caixa.",
    "stakeholders": "FP&A; Controladoria; Finanças; Conselho Fiscal; auditoria externa. Destinos: Diretoria, Conselho, fisco.",
    "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA, Controladoria, Contabilidade, Finanças, Tesouraria, Contas a Pagar",
    "businessUnit": "Processos de Suporte",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-r2r-pol-1",
        "name": "Normas contábeis (ITG 2002 — entidades sem fins lucrativos)",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-r2r-pol-2",
        "name": "legislação tributária",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-r2r-pol-3",
        "name": "estatuto (Conselho Fiscal)",
        "type": "Estatuto / Regimento",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Desvio orçado x realizado",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Dias de fechamento",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Obrigações entregues no prazo",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Ressalvas de auditoria",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Sistemas de Controladoria - Protheus",
      "Fluig",
      "Plano",
      "Banco BTG",
      "Banco do Bradesco",
      "Banco do Brasil",
      "Itaú",
      "Santander",
      "Jira",
      "Total Bank",
      "Caixa",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Protheus como ERP contábil-fiscal",
      "TO-BE: Plano para orçamento",
      "TO-BE: Fluig para aprovações",
      "TO-BE: internet banking dos bancos para tesouraria"
    ],
    "painPoints": [
      "Dependência do Protheus e de seus provedores",
      "Processos 'Muito Crítico' com prazo legal",
      "Múltiplos bancos sem integração"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-r2r-1",
        "name": "Planejar, Orçar e Analisar",
        "code": "R2R.1",
        "description": "Planejar, orçar e analisar.",
        "objective": "Planejar, orçar e analisar.",
        "valueProposition": "Recursos alocados e acompanhados com disciplina.",
        "scopeBoundary": "Compreende os L3: R2R.1.1 Elaborar e Acompanhar Orçamento. Insere-se no L1 R2R e se limita às atividades descritas nesses L3.",
        "inputs": "Relação de contratos; planilhas das áreas de negócio; relatório de faturamento; Projeção atualizada extraída do sistema Plano. Fornecedores: Área interna.",
        "outputs": "Orçamento Anual (Excel e Powerpoint); Documentos de formalização do Orçamento Selic revisado.",
        "stakeholders": "Áreas executoras: FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA. Destinos: Áreas internas; Área interna e Associados (membros da Diretoria); Área interna (time Anbima Selic) e Bacen.",
        "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Desvio orçado x realizado",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4, Moderado: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Plano",
          "Microsoft Outlook",
          "Microsoft Teams",
          "Sistemas de Controladoria - Protheus",
          "Fluig",
          "Microsoft Excel",
          "Microsoft SharePoint"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 3 macroprocesso(s) (OP-036, OP-037, OP-127)",
          "Dependência de pessoa-chave em OP-127, OP-185",
          "Procedimento não documentado ou só informal em OP-035, OP-096, OP-185",
          "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2r-1-1",
            "name": "Elaborar e Acompanhar Orçamento",
            "code": "R2R.1.1",
            "description": "Elabora orçamento anual, acompanha execução e revisões.",
            "objective": "Elabora orçamento anual, acompanha execução e revisões.",
            "valueProposition": "Elaborar o orçamento do exercício seguinte, consolidando as estimativas de receitas,… / Revisar e atualizar o orçamento do Convênio ANBIMA/Bacen, preparando a documentação de… / Consolidar e validar as receitas, despesas e os investimentos do período, garantindo a…",
            "scopeBoundary": "Atividades L4: Elaborar orçamento anual; Revisar orçamento do convênio ANBIMA/Bacen; Fechar e analisar resultado gerencial mensal; Acompanhar orçamento das áreas [OP-096; OP-127; OP-185]. Macroprocessos AS-IS: OP-036, OP-037, OP-035, OP-096, OP-127, OP-185.",
            "inputs": "Relação de contratos; planilhas das áreas de negócio; relatório de faturamento; Projeção atualizada extraída do sistema Plano. Fornecedores: Área interna.",
            "outputs": "Orçamento Anual (Excel e Powerpoint); Documentos de formalização do Orçamento Selic revisado.",
            "stakeholders": "Áreas executoras: FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA. Destinos: Áreas internas; Área interna e Associados (membros da Diretoria); Área interna (time Anbima Selic) e Bacen.",
            "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Anual, Trimestral, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4, Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Plano",
              "Microsoft Outlook",
              "Microsoft Teams",
              "Sistemas de Controladoria - Protheus",
              "Fluig",
              "Microsoft Excel",
              "Microsoft SharePoint"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-036, OP-037, OP-127)",
              "Dependência de pessoa-chave em OP-127, OP-185",
              "Procedimento não documentado ou só informal em OP-035, OP-096, OP-185",
              "Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "Impactos/penalidades declarados: Não há penalidade formal"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-036, OP-037, OP-035, OP-096, OP-127, OP-185"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2r-1-1-1",
                "name": "Elaborar orçamento anual",
                "code": "R2R.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                "scopeBoundary": "Atividade do L3 R2R.1.1 Elaborar e Acompanhar Orçamento.",
                "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-1-1-2",
                "name": "Revisar orçamento do convênio ANBIMA/Bacen",
                "code": "R2R.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                "scopeBoundary": "Atividade do L3 R2R.1.1 Elaborar e Acompanhar Orçamento.",
                "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-1-1-3",
                "name": "Fechar e analisar resultado gerencial mensal",
                "code": "R2R.1.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                "scopeBoundary": "Atividade do L3 R2R.1.1 Elaborar e Acompanhar Orçamento.",
                "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-1-1-4",
                "name": "Acompanhar orçamento das áreas",
                "code": "R2R.1.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-096; OP-127; OP-185).",
                "scopeBoundary": "Atividade do L3 R2R.1.1 Elaborar e Acompanhar Orçamento.",
                "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2r-2",
        "name": "Registrar e Contabilizar",
        "code": "R2R.2",
        "description": "Registrar e contabilizar transações.",
        "objective": "Registrar e contabilizar transações.",
        "valueProposition": "Contabilidade fidedigna e tempestiva.",
        "scopeBoundary": "Compreende os L3: R2R.2.1 Processar Transações Contábeis. Insere-se no L1 R2R e se limita às atividades descritas nesses L3.",
        "inputs": "Consulta cadastra de CNPJ/Lei Complementar 116/157/ e todas as fontes necessárias para…; Buscamos os documentos fiscais e legislações vigentes para caso ocorra inconsistências… Fornecedores: Área interna.",
        "outputs": "Esse processo é utilizado em rotinas internas da área de controladoria em atendimento…; Títulos para pagamento no financeiro e obrigações acessórias.",
        "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Área interna e Fornecedores/prestadores; Mercado em Geral e Áreas Internas.",
        "responsible": "Controladoria, Contabilidade",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-r2r-2-pol-1",
            "name": "Todos os pagamentos das associação estão vinculados as condições estabelecidas nos…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2r-2-pol-2",
            "name": "Todos os pagamentos das associação estão vinculados as condições estabelecidas nos…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2r-2-pol-3",
            "name": "Nossos recebimentos sempre estão condicionados a politicas divulgadas em nossos canais…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Lançamentos pendentes no fechamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Muito Crítico: 2, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Fluig",
          "Sistemas de Controladoria - Protheus",
          "Jira"
        ],
        "painPoints": [
          "2 de 3 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 3 macroprocesso(s) (OP-038, OP-039, OP-040)",
          "Impactos/penalidades declarados: Caso não ocorra os pagamentos a associação poderá ser protestada",
          "Caso não ocorra os pagamentos a associação poderá ser protestada ou solicita a…",
          "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2r-2-1",
            "name": "Processar Transações Contábeis",
            "code": "R2R.2.1",
            "description": "Contabiliza provisões, pagamentos, faturamento e recebimentos.",
            "objective": "Contabiliza provisões, pagamentos, faturamento e recebimentos.",
            "valueProposition": "Parametrização dos cadastros de fornecedores e parametrização das retenção facilitando… / Neste processo envolve todas as notas de fiscais de entrada da associação para seguir… / Neste processo envolve todas as notas de fiscais de saída da associação até o…",
            "scopeBoundary": "Atividades L4: Manter cadastros contábeis (fornecedores, naturezas, centros de custo); Contabilizar provisões e pagamentos; Contabilizar faturamento e recebimentos e tratar inconsistências. Macroprocessos AS-IS: OP-038, OP-039, OP-040.",
            "inputs": "Consulta cadastra de CNPJ/Lei Complementar 116/157/ e todas as fontes necessárias para…; Buscamos os documentos fiscais e legislações vigentes para caso ocorra inconsistências… Fornecedores: Área interna.",
            "outputs": "Esse processo é utilizado em rotinas internas da área de controladoria em atendimento…; Títulos para pagamento no financeiro e obrigações acessórias.",
            "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Área interna e Fornecedores/prestadores; Mercado em Geral e Áreas Internas.",
            "responsible": "Controladoria, Contabilidade",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2r-2-1-pol-1",
                "name": "Todos os pagamentos das associação estão vinculados as condições estabelecidas nos…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2r-2-1-pol-2",
                "name": "Todos os pagamentos das associação estão vinculados as condições estabelecidas nos…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Fluig",
              "Sistemas de Controladoria - Protheus",
              "Jira"
            ],
            "painPoints": [
              "2 de 3 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-038, OP-039, OP-040)",
              "Impactos/penalidades declarados: Caso não ocorra os pagamentos a associação poderá ser protestada",
              "Caso não ocorra os pagamentos a associação poderá ser protestada ou solicita a…",
              "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-038, OP-039, OP-040"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2r-2-1-1",
                "name": "Manter cadastros contábeis (fornecedores, naturezas, centros de custo)",
                "code": "R2R.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                "scopeBoundary": "Atividade do L3 R2R.2.1 Processar Transações Contábeis.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-2-1-2",
                "name": "Contabilizar provisões e pagamentos",
                "code": "R2R.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                "scopeBoundary": "Atividade do L3 R2R.2.1 Processar Transações Contábeis.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-2-1-3",
                "name": "Contabilizar faturamento e recebimentos e tratar inconsistências",
                "code": "R2R.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                "scopeBoundary": "Atividade do L3 R2R.2.1 Processar Transações Contábeis.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2r-3",
        "name": "Apurar Tributos e Obrigações",
        "code": "R2R.3",
        "description": "Apurar tributos e entregar obrigações acessórias.",
        "objective": "Apurar tributos e entregar obrigações acessórias.",
        "valueProposition": "Conformidade fiscal sem multas.",
        "scopeBoundary": "Compreende os L3: R2R.3.1 Apurar Tributos e Entregar Obrigações. Insere-se no L1 R2R e se limita às atividades descritas nesses L3.",
        "inputs": "Quando ocorre dúvida ferente ao faturamento ou as baixas dos títulos recebidos sempre…; Utilizamos doas os imputes de notas e documentos no sistema. Fornecedores: Áreas Internas e Portais governamentais e sistemas oficiais de consulta contábil e…",
        "outputs": "O relatório final das receitas dos período tais como os impostos incidentes sobre os…; Todos os serviços tomado e prestado no decorrer do mês.",
        "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Mercado em Geral, Governo e Áreas Internas.",
        "responsible": "Controladoria, Contabilidade",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-r2r-3-pol-1",
            "name": "Nossos recebimentos sempre estão condicionados a politicas divulgadas em nossos canais…",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          },
          {
            "id": "anb-l2-r2r-3-pol-2",
            "name": "Todas as obrigações acessórias da ANBIMA estão centralizadas neste item",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Obrigações no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Multas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Muito Crítico: 2",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Fluig",
          "Sistemas de Controladoria - Protheus"
        ],
        "painPoints": [
          "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 2 macroprocesso(s) (OP-041, OP-042)",
          "Impactos/penalidades declarados: Caso ocorra cobranças indevidas por parte da ANBIMA estamos sujeitos a sermos…",
          "Estamos sujeitos a pagamentos de multas extremamente elevadas, caso ocorra envio de…",
          "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2r-3-1",
            "name": "Apurar Tributos e Entregar Obrigações",
            "code": "R2R.3.1",
            "description": "Apura tributos e entrega obrigações acessórias.",
            "objective": "Apura tributos e entrega obrigações acessórias.",
            "valueProposition": "O objetivo dessa rotina é integrar todos os títulos faturados e recebidos no módulo… / Envio das obrigações acessórias e conferência evitando que a associação esteja exposta…",
            "scopeBoundary": "Atividades L4: Apurar ISS; Entregar obrigações acessórias. Macroprocessos AS-IS: OP-041, OP-042.",
            "inputs": "Quando ocorre dúvida ferente ao faturamento ou as baixas dos títulos recebidos sempre…; Utilizamos doas os imputes de notas e documentos no sistema. Fornecedores: Áreas Internas e Portais governamentais e sistemas oficiais de consulta contábil e…",
            "outputs": "O relatório final das receitas dos período tais como os impostos incidentes sobre os…; Todos os serviços tomado e prestado no decorrer do mês.",
            "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Mercado em Geral, Governo e Áreas Internas.",
            "responsible": "Controladoria, Contabilidade",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2r-3-1-pol-1",
                "name": "Nossos recebimentos sempre estão condicionados a politicas divulgadas em nossos canais…",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              },
              {
                "id": "anb-l3-r2r-3-1-pol-2",
                "name": "Todas as obrigações acessórias da ANBIMA estão centralizadas neste item",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Muito Crítico: 2",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Fluig",
              "Sistemas de Controladoria - Protheus"
            ],
            "painPoints": [
              "2 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-041, OP-042)",
              "Impactos/penalidades declarados: Caso ocorra cobranças indevidas por parte da ANBIMA estamos sujeitos a sermos…",
              "Estamos sujeitos a pagamentos de multas extremamente elevadas, caso ocorra envio de…",
              "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-041, OP-042"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2r-3-1-1",
                "name": "Apurar ISS",
                "code": "R2R.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-041, OP-042).",
                "scopeBoundary": "Atividade do L3 R2R.3.1 Apurar Tributos e Entregar Obrigações.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-3-1-2",
                "name": "Entregar obrigações acessórias",
                "code": "R2R.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-041, OP-042).",
                "scopeBoundary": "Atividade do L3 R2R.3.1 Apurar Tributos e Entregar Obrigações.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2r-4",
        "name": "Fechar e Reportar",
        "code": "R2R.4",
        "description": "Fechar o período e reportar demonstrações.",
        "objective": "Fechar o período e reportar demonstrações.",
        "valueProposition": "Demonstrações auditadas sem ressalvas.",
        "scopeBoundary": "Compreende os L3: R2R.4.1 Fechar e Reportar Demonstrações. Insere-se no L1 R2R e se limita às atividades descritas nesses L3.",
        "inputs": "Utilizamos doas os imputes de notas e documentos no sistema. Fornecedores: Áreas Internas e Portais governamentais e sistemas oficiais de consulta contábil e…",
        "outputs": "Todas as movimentação e fatos ocorridos durante o período de 12 meses.",
        "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Mercado em Geral, Governo e Áreas Internas.",
        "responsible": "Controladoria, Contabilidade",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-r2r-4-pol-1",
            "name": "Esse trabalho é desenvolvido no decorrer do exercício vigente",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Dias de fechamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Ressalvas",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Fluig",
          "Sistemas de Controladoria - Protheus"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-043)",
          "Impactos/penalidades declarados: Todos esses trabalhos passam por aprovação do nosso conselho fiscal",
          "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2r-4-1",
            "name": "Fechar e Reportar Demonstrações",
            "code": "R2R.4.1",
            "description": "Fecha o período e reporta demonstrações financeiras auditadas.",
            "objective": "Fecha o período e reporta demonstrações financeiras auditadas.",
            "valueProposition": "Todos os trabalho de forma geral que já desenvolvidos tem como objetivo principal…",
            "scopeBoundary": "Atividades L4: Executar fechamento contábil e demonstrações auditadas. Macroprocessos AS-IS: OP-043.",
            "inputs": "Utilizamos doas os imputes de notas e documentos no sistema. Fornecedores: Áreas Internas e Portais governamentais e sistemas oficiais de consulta contábil e…",
            "outputs": "Todas as movimentação e fatos ocorridos durante o período de 12 meses.",
            "stakeholders": "Áreas executoras: Controladoria, Contabilidade. Destinos: Mercado em Geral, Governo e Áreas Internas.",
            "responsible": "Controladoria, Contabilidade",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-r2r-4-1-pol-1",
                "name": "Esse trabalho é desenvolvido no decorrer do exercício vigente",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Fluig",
              "Sistemas de Controladoria - Protheus"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-043)",
              "Impactos/penalidades declarados: Todos esses trabalhos passam por aprovação do nosso conselho fiscal",
              "Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-043"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2r-4-1-1",
                "name": "Executar fechamento contábil e demonstrações auditadas",
                "code": "R2R.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-043).",
                "scopeBoundary": "Atividade do L3 R2R.4.1 Fechar e Reportar Demonstrações.",
                "responsible": "Controladoria, Contabilidade",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-r2r-5",
        "name": "Gerir Tesouraria",
        "code": "R2R.5",
        "description": "Gerir tesouraria e liquidez.",
        "objective": "Gerir tesouraria e liquidez.",
        "valueProposition": "Caixa disponível e aplicado com segurança.",
        "scopeBoundary": "Compreende os L3: R2R.5.1 Gerir Caixa e Liquidez. Insere-se no L1 R2R e se limita às atividades descritas nesses L3.",
        "inputs": "Extratos, borderô de pagamentos; Extratos bancarios. Fornecedores: – Bancos e Protheus; Instituições financeiras e Contas a pagar e Tesouraria.",
        "outputs": "Posição de caixa disponível; Movimentações bancárias conciliadas e registradas.",
        "stakeholders": "Áreas executoras: Finanças, Tesouraria, Contas a Pagar. Destinos: Áreas internas.",
        "responsible": "Finanças, Tesouraria, Contas a Pagar",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Saldo conciliado",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Rentabilidade",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 2",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Banco BTG",
          "Banco do Bradesco",
          "Banco do Brasil",
          "Itaú",
          "Microsoft Excel",
          "Santander",
          "Total Bank",
          "Caixa"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 2 macroprocesso(s) (OP-016, OP-029)",
          "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-r2r-5-1",
            "name": "Gerir Caixa e Liquidez",
            "code": "R2R.5.1",
            "description": "Gerencia posição de caixa, conciliação bancária e aplicações.",
            "objective": "Gerencia posição de caixa, conciliação bancária e aplicações.",
            "valueProposition": "Garantir a adequada gestão dos recursos financeiros da ANBIMA por meio do… / Conciliação de todos os valores efetuados e recebidos nas contas bancárias.",
            "scopeBoundary": "Atividades L4: Gerir posição de caixa; Executar conciliação bancária; Gerir aplicações financeiras . Macroprocessos AS-IS: OP-016, OP-029.",
            "inputs": "Extratos, borderô de pagamentos; Extratos bancarios. Fornecedores: – Bancos e Protheus; Instituições financeiras e Contas a pagar e Tesouraria.",
            "outputs": "Posição de caixa disponível; Movimentações bancárias conciliadas e registradas.",
            "stakeholders": "Áreas executoras: Finanças, Tesouraria, Contas a Pagar. Destinos: Áreas internas.",
            "responsible": "Finanças, Tesouraria, Contas a Pagar",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Banco BTG",
              "Banco do Bradesco",
              "Banco do Brasil",
              "Itaú",
              "Microsoft Excel",
              "Santander",
              "Total Bank"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-016, OP-029)",
              "Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-016, OP-029"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-r2r-5-1-1",
                "name": "Gerir posição de caixa",
                "code": "R2R.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-016, OP-029).",
                "scopeBoundary": "Atividade do L3 R2R.5.1 Gerir Caixa e Liquidez.",
                "responsible": "Finanças, Tesouraria, Contas a Pagar",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-5-1-2",
                "name": "Executar conciliação bancária",
                "code": "R2R.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-016, OP-029).",
                "scopeBoundary": "Atividade do L3 R2R.5.1 Gerir Caixa e Liquidez.",
                "responsible": "Finanças, Tesouraria, Contas a Pagar",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-r2r-5-1-3",
                "name": "Gerir aplicações financeiras",
                "code": "R2R.5.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 R2R.5.1 Gerir Caixa e Liquidez.",
                "responsible": "Finanças, Tesouraria, Contas a Pagar",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-tec",
    "name": "Tecnologia e Dados",
    "code": "TEC",
    "domain": "Processo de Suporte",
    "category": "SUPPORT",
    "description": "Definir estratégia e arquitetura, entregar e sustentar soluções e plataformas de dados, gerir acessos, custos e segurança.",
    "objective": "Definir estratégia e arquitetura, entregar e sustentar soluções e plataformas de dados, gerir acessos, custos e segurança.",
    "valueProposition": "Prover tecnologia confiável e escalável que suporta os produtos de dados críticos e a operação da associação.",
    "scopeBoundary": "Estratégia/portfólio, desenvolvimento e implantação, requisição e atendimento (acessos), detecção e correção (incidentes, backup) e sustentação de plataformas.",
    "inputs": "Demandas das áreas; arquitetura de referência; contratos de nuvem; incidentes; requisitos de segurança e LGPD.",
    "outputs": "Arquitetura e catálogo de dados; pipelines e soluções; acessos concedidos/revogados; incidentes tratados; plataformas disponíveis.",
    "stakeholders": "Tecnologia; Dados; fornecedores (Databricks, AWS, Dataiku). Destinos: todas as áreas, especialmente C2P e R2E.",
    "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
    "businessUnit": "Processos de Suporte",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-tec-pol-1",
        "name": "Política de segurança da informação",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-tec-pol-2",
        "name": "LGPD",
        "type": "Norma Regulatória",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-tec-pol-3",
        "name": "política de acessos",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "Disponibilidade de plataformas",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "MTTR",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Custo de nuvem vs. orçamento",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Tempo de concessão de acesso",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Databricks",
      "Dataiku",
      "Open Metadata",
      "Plataforma FinOps",
      "power bi",
      "Jira",
      "Pipefy",
      "Plataforma de Backup - Shared",
      "Plataforma de Backup - Workload",
      "Plataforma de Backup - Workload Dev",
      "Plataforma de Backup - Workload HML",
      "Plataforma de Backup - Workload PRD",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Databricks/AWS como plataforma de dados",
      "TO-BE: Dataiku",
      "TO-BE: OpenMetadata",
      "TO-BE: plataforma FinOps",
      "TO-BE: Jira para ITSM",
      "TO-BE: plataforma de backup"
    ],
    "painPoints": [
      "Dependência crítica de Databricks/AWS",
      "Ausência de contingência para ETLs",
      "Segurança da informação não explicitada em L3"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-tec-1",
        "name": "Estratégia a Portfólio",
        "code": "TEC.1",
        "description": "Definir estratégia, arquitetura, governança de dados e custos de tecnologia.",
        "objective": "Definir estratégia, arquitetura, governança de dados e custos de tecnologia.",
        "valueProposition": "Tecnologia alinhada ao negócio e com custo controlado.",
        "scopeBoundary": "Compreende os L3: TEC.1.1 Gerir Arquitetura e Governança de Dados; TEC.1.2 Gerir Custos de Tecnologia (FinOps). Insere-se no L1 TEC e se limita às atividades descritas nesses L3.",
        "inputs": "Diagramas de arquitetura, catálogo de dados, documentos de padrões e diretrizes.…; Catálogo de dados, políticas de governança, matriz de data owners, regras de… Fornecedores: Área interna.",
        "outputs": "Padrões de arquitetura aprovados, diretrizes de engenharia, pareceres técnicos e…; Políticas publicadas, catálogo atualizado, dados classificados e indicadores de qualidade.",
        "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI. Destinos: Áreas internas; Quem recebe as entregas: pode ser, áreas internas, externas.",
        "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [
          {
            "id": "anb-l2-tec-1-pol-1",
            "name": "Sim - prazo regulatório (norma/lei)",
            "type": "Política Interna",
            "version": "—",
            "status": "vigente"
          }
        ],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Custo cloud vs. orçamento",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "% ativos catalogados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Moderado: 3, Baixo: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Databricks",
          "Open Metadata",
          "Plataforma FinOps",
          "Dataiku"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 4 macroprocesso(s) (OP-105, OP-122, OP-123, OP-116)",
          "Dependência de pessoa-chave em OP-123, OP-116",
          "Impactos/penalidades declarados: Sanção/advertência do regulador",
          "Dependência de terceiros: Databricks (plataforma) e AWS — indispensáveis para hospedagem e processamento dos dados",
          "Databricks (Unity Catalog) — utilizado como catálogo e ponto de controle de governança"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-tec-1-1",
            "name": "Gerir Arquitetura e Governança de Dados",
            "code": "TEC.1.1",
            "description": "Define arquitetura, governança, catálogo e qualidade de dados.",
            "objective": "Define arquitetura, governança, catálogo e qualidade de dados.",
            "valueProposition": "Definir, manter e governar a arquitetura de dados e os padrões de engenharia que… / Definir e manter políticas, papéis e controles de governança de dados, incluindo… / Operar e sustentar a plataforma OpenMetadata, mantendo o catálogo de metadados, a…",
            "scopeBoundary": "Atividades L4: Gerir arquitetura, engenharia e governança de dados; Executar governança de dados; Operar catálogo de metadados (OpenMetadata). Macroprocessos AS-IS: OP-105, OP-122, OP-123.",
            "inputs": "Diagramas de arquitetura, catálogo de dados, documentos de padrões e diretrizes.…; Catálogo de dados, políticas de governança, matriz de data owners, regras de… Fornecedores: Área interna.",
            "outputs": "Padrões de arquitetura aprovados, diretrizes de engenharia, pareceres técnicos e…; Políticas publicadas, catálogo atualizado, dados classificados e indicadores de qualidade.",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados. Destinos: Áreas internas; Quem recebe as entregas: pode ser, áreas internas, externas.",
            "responsible": "Tecnologia, Engenharia de Dados",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [
              {
                "id": "anb-l3-tec-1-1-pol-1",
                "name": "Sim - prazo regulatório (norma/lei)",
                "type": "Política Interna",
                "version": "—",
                "status": "vigente"
              }
            ],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário, Sob demanda",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Moderado: 3",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Databricks",
              "Open Metadata"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 3 macroprocesso(s) (OP-105, OP-122, OP-123)",
              "Dependência de pessoa-chave em OP-123",
              "Impactos/penalidades declarados: Sanção/advertência do regulador",
              "Dependência de terceiros: Databricks (plataforma) e AWS — indispensáveis para hospedagem e processamento dos dados",
              "Databricks (Unity Catalog) — utilizado como catálogo e ponto de controle de governança"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-105, OP-122, OP-123"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-1-1-1",
                "name": "Gerir arquitetura, engenharia e governança de dados",
                "code": "TEC.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                "scopeBoundary": "Atividade do L3 TEC.1.1 Gerir Arquitetura e Governança de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-1-1-2",
                "name": "Executar governança de dados",
                "code": "TEC.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                "scopeBoundary": "Atividade do L3 TEC.1.1 Gerir Arquitetura e Governança de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-1-1-3",
                "name": "Operar catálogo de metadados (OpenMetadata)",
                "code": "TEC.1.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                "scopeBoundary": "Atividade do L3 TEC.1.1 Gerir Arquitetura e Governança de Dados.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          },
          {
            "id": "anb-l3-tec-1-2",
            "name": "Gerir Custos de Tecnologia (FinOps)",
            "code": "TEC.1.2",
            "description": "Gerencia custos de nuvem e plataformas.",
            "objective": "Gerencia custos de nuvem e plataformas.",
            "valueProposition": "Controlar, analisar e otimizar custos dos ambientes em nuvem da ANBIMA / Monitorar e otimizar os custos de consumo do Databricks e da nuvem, garantindo…",
            "scopeBoundary": "Atividades L4: Gerir FinOps de cloud; Gerir FinOps Databricks. Macroprocessos AS-IS: OP-099, OP-116.",
            "inputs": "Relatórios de consumo, orçamento aprovado, demonstrativos financeiros; Relatórios de consumo do Databricks e da AWS, planilha de orçamento, faturas dos… Fornecedores: Área interna.",
            "outputs": "Relatórios de custos, previsões, recomendações de otimização; Relatório mensal de custos, análise de desvios e recomendações de otimização.",
            "stakeholders": "Áreas executoras: Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados. Destinos: Áreas internas.",
            "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Mensal",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Plataforma FinOps",
              "Dataiku"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-116)",
              "Dependência de pessoa-chave em OP-116",
              "Dependência de terceiros: AWS, Azure, Google Cloud e parceiros especializado",
              "Databricks e AWS — fornecem os dados de consumo e faturamento"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-099, OP-116"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-1-2-1",
                "name": "Gerir FinOps de cloud",
                "code": "TEC.1.2.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-099, OP-116).",
                "scopeBoundary": "Atividade do L3 TEC.1.2 Gerir Custos de Tecnologia (FinOps).",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-1-2-2",
                "name": "Gerir FinOps Databricks",
                "code": "TEC.1.2.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-099, OP-116).",
                "scopeBoundary": "Atividade do L3 TEC.1.2 Gerir Custos de Tecnologia (FinOps).",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-tec-2",
        "name": "Requisito a Implantação",
        "code": "TEC.2",
        "description": "Desenvolver e implantar soluções.",
        "objective": "Desenvolver e implantar soluções.",
        "valueProposition": "Entregas rápidas e estáveis.",
        "scopeBoundary": "Compreende os L3: TEC.2.1 Desenvolver e Implantar Soluções. Insere-se no L1 TEC e se limita às atividades descritas nesses L3.",
        "inputs": "Requisitos de negócio, repositório de código, catálogo de dados, documentação dos…; Documentação das APIs, credenciais de integração, mapeamentos de dados, logs de execução. Fornecedores: Área interna.",
        "outputs": "Workflow criado, agendado e monitorado em produção; Dados integrados e disponíveis no lakehouse ou nas aplicações de destino.",
        "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados. Destinos: Áreas internas.",
        "responsible": "Tecnologia, Engenharia de Dados",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Lead time",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Falhas pós-deploy",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Databricks",
          "power bi"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 4 macroprocesso(s) (OP-110, OP-112, OP-120, OP-121)",
          "Dependência de terceiros: Databricks e AWS — indispensáveis para orquestração e processamento",
          "Databricks e AWS, além dos fornecedores das aplicações integradas"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-tec-2-1",
            "name": "Desenvolver e Implantar Soluções",
            "code": "TEC.2.1",
            "description": "Constrói pipelines, integrações e esteiras de entrega contínua.",
            "objective": "Constrói pipelines, integrações e esteiras de entrega contínua.",
            "valueProposition": "Construir e agendar workflows que automatizam a execução dos pipelines de ingestão e… / Integrar o lakehouse às demais aplicações corporativas, garantindo troca de dados… / Manter e operar a esteira de CI/CD que promove códigos e pipelines de engenharia de…",
            "scopeBoundary": "Atividades L4: Criar workflows de automação de pipelines; Integrar lakehouse com demais aplicações; Operar esteira CI/CD de engenharia de dados; Operar esteira CI/CD de Power BI. Macroprocessos AS-IS: OP-110, OP-112, OP-120, OP-121.",
            "inputs": "Requisitos de negócio, repositório de código, catálogo de dados, documentação dos…; Documentação das APIs, credenciais de integração, mapeamentos de dados, logs de execução. Fornecedores: Área interna.",
            "outputs": "Workflow criado, agendado e monitorado em produção; Dados integrados e disponíveis no lakehouse ou nas aplicações de destino.",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados. Destinos: Áreas internas.",
            "responsible": "Tecnologia, Engenharia de Dados",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Diário, Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Databricks",
              "power bi"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 4 macroprocesso(s) (OP-110, OP-112, OP-120, OP-121)",
              "Dependência de terceiros: Databricks e AWS — indispensáveis para orquestração e processamento",
              "Databricks e AWS, além dos fornecedores das aplicações integradas"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-110, OP-112, OP-120, OP-121"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-2-1-1",
                "name": "Criar workflows de automação de pipelines",
                "code": "TEC.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                "scopeBoundary": "Atividade do L3 TEC.2.1 Desenvolver e Implantar Soluções.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-2-1-2",
                "name": "Integrar lakehouse com demais aplicações",
                "code": "TEC.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                "scopeBoundary": "Atividade do L3 TEC.2.1 Desenvolver e Implantar Soluções.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-2-1-3",
                "name": "Operar esteira CI/CD de engenharia de dados",
                "code": "TEC.2.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                "scopeBoundary": "Atividade do L3 TEC.2.1 Desenvolver e Implantar Soluções.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-2-1-4",
                "name": "Operar esteira CI/CD de Power BI",
                "code": "TEC.2.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                "scopeBoundary": "Atividade do L3 TEC.2.1 Desenvolver e Implantar Soluções.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-tec-3",
        "name": "Requisição a Atendimento",
        "code": "TEC.3",
        "description": "Atender requisições e gerir acessos.",
        "objective": "Atender requisições e gerir acessos.",
        "valueProposition": "Acessos seguros e ágeis.",
        "scopeBoundary": "Compreende os L3: TEC.3.1 Provisionar Acessos e Identidades. Insere-se no L1 TEC e se limita às atividades descritas nesses L3.",
        "inputs": "Cadastro do colaborador, solicitação de acesso, contratos de terceiros e aprovações; Chamado de solicitação, política de acessos, documentação da aplicação integradora. Fornecedores: Área interna.",
        "outputs": "Usuário provisionado ou acessos revogados; Acesso concedido ou revogado, com registro de evidência no chamado.",
        "stakeholders": "Áreas executoras: Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados. Destinos: Áreas internas.",
        "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Tempo de concessão",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Acessos revogados no prazo",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 4, Moderado: 2",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Databricks",
          "Microsoft Teams",
          "Jira",
          "Pipefy",
          "Dataiku"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 5 macroprocesso(s) (OP-106, OP-108, OP-107, OP-109, OP-118)",
          "Dependência de terceiros: Databricks — plataforma onde os acessos são administrados",
          "Databricks (Unity Catalog) — indispensável para administração das permissões"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-tec-3-1",
            "name": "Provisionar Acessos e Identidades",
            "code": "TEC.3.1",
            "description": "Concede e revoga acessos a sistemas e plataformas.",
            "objective": "Concede e revoga acessos a sistemas e plataformas.",
            "valueProposition": "Garantir a entrada e a concessão adequada e tempestiva de acessos a colaboradores… / Conceder e revogar acessos de usuários aos workspaces do Databricks conforme política… / Conceder e revogar permissões de leitura e escrita sobre tabelas e schemas do lakehouse.",
            "scopeBoundary": "Atividades L4: Conceder acessos a colaboradores e usuários externos; Conceder e revogar acesso a workspaces; Conceder e revogar acesso a dados do lakehouse; Criar service principals; Criar tokens pessoais (PAT); Conceder e revogar acesso ao Dataiku. Macroprocessos AS-IS: OP-098, OP-106, OP-108, OP-107, OP-109, OP-118.",
            "inputs": "Cadastro do colaborador, solicitação de acesso, contratos de terceiros e aprovações; Chamado de solicitação, política de acessos, documentação da aplicação integradora. Fornecedores: Área interna.",
            "outputs": "Usuário provisionado ou acessos revogados; Acesso concedido ou revogado, com registro de evidência no chamado.",
            "stakeholders": "Áreas executoras: Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados. Destinos: Áreas internas.",
            "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Sob demanda, Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 4, Moderado: 2",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Databricks",
              "Microsoft Teams",
              "Jira",
              "Pipefy",
              "Dataiku"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 5 macroprocesso(s) (OP-106, OP-108, OP-107, OP-109, OP-118)",
              "Dependência de terceiros: Databricks — plataforma onde os acessos são administrados",
              "Databricks (Unity Catalog) — indispensável para administração das permissões"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-098, OP-106, OP-108, OP-107, OP-109, OP-118"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-3-1-1",
                "name": "Conceder acessos a colaboradores e usuários externos",
                "code": "TEC.3.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-3-1-2",
                "name": "Conceder e revogar acesso a workspaces",
                "code": "TEC.3.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-3-1-3",
                "name": "Conceder e revogar acesso a dados do lakehouse",
                "code": "TEC.3.1.3",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-3-1-4",
                "name": "Criar service principals",
                "code": "TEC.3.1.4",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-3-1-5",
                "name": "Criar tokens pessoais (PAT)",
                "code": "TEC.3.1.5",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-3-1-6",
                "name": "Conceder e revogar acesso ao Dataiku",
                "code": "TEC.3.1.6",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                "scopeBoundary": "Atividade do L3 TEC.3.1 Provisionar Acessos e Identidades.",
                "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-tec-4",
        "name": "Detectar a Corrigir",
        "code": "TEC.4",
        "description": "Detectar incidentes e recuperar serviços.",
        "objective": "Detectar incidentes e recuperar serviços.",
        "valueProposition": "Mínimo impacto de falhas.",
        "scopeBoundary": "Compreende os L3: TEC.4.1 Monitorar e Recuperar Serviços. Insere-se no L1 TEC e se limita às atividades descritas nesses L3.",
        "inputs": "Logs de execução, métricas de jobs, regras de qualidade de dados, painéis de monitoramento; Política de Backup, inventário de ativos, procedimentos de recuperação e relatórios de… Fornecedores: Área interna.",
        "outputs": "Painéis de monitoramento, alertas de falha e relatórios de qualidade de dados; Cópias de segurança válidas e recuperação de informações quando solicitada.",
        "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI. Destinos: Áreas internas.",
        "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "MTTR",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Testes de restore",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 1, Moderado: 1",
            "target": "—",
            "status": "atencao"
          }
        ],
        "systems": [
          "Databricks",
          "Plataforma de Backup - Shared",
          "Plataforma de Backup - Workload",
          "Plataforma de Backup - Workload Dev",
          "Plataforma de Backup - Workload HML",
          "Plataforma de Backup - Workload PRD"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-113)",
          "Dependência de pessoa-chave em OP-097",
          "Dependência de terceiros: Databricks e AWS — indispensáveis para coleta e armazenamento das métricas",
          "Fabricante da solução de backup ou provedor cloud"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-tec-4-1",
            "name": "Monitorar e Recuperar Serviços",
            "code": "TEC.4.1",
            "description": "Monitora, trata incidentes e garante recuperação de dados.",
            "objective": "Monitora, trata incidentes e garante recuperação de dados.",
            "valueProposition": "Monitorar a saúde, o desempenho e a qualidade dos pipelines e dos dados da plataforma,… / Assegurar a disponibilidade e a recuperação de dados em caso de falhas, perdas ou…",
            "scopeBoundary": "Atividades L4: Observar e tratar incidentes de dados; Executar e recuperar backups; Gerir incidentes de cibersegurança . Macroprocessos AS-IS: OP-113, OP-097.",
            "inputs": "Logs de execução, métricas de jobs, regras de qualidade de dados, painéis de monitoramento; Política de Backup, inventário de ativos, procedimentos de recuperação e relatórios de… Fornecedores: Área interna.",
            "outputs": "Painéis de monitoramento, alertas de falha e relatórios de qualidade de dados; Cópias de segurança válidas e recuperação de informações quando solicitada.",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI. Destinos: Áreas internas.",
            "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Contínuo (tempo real), Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 1, Moderado: 1",
                "target": "—",
                "status": "atencao"
              }
            ],
            "systems": [
              "Databricks",
              "Plataforma de Backup - Shared",
              "Plataforma de Backup - Workload",
              "Plataforma de Backup - Workload Dev",
              "Plataforma de Backup - Workload HML",
              "Plataforma de Backup - Workload PRD"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-113)",
              "Dependência de pessoa-chave em OP-097",
              "Dependência de terceiros: Databricks e AWS — indispensáveis para coleta e armazenamento das métricas",
              "Fabricante da solução de backup ou provedor cloud"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-113, OP-097"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-4-1-1",
                "name": "Observar e tratar incidentes de dados",
                "code": "TEC.4.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-113, OP-097).",
                "scopeBoundary": "Atividade do L3 TEC.4.1 Monitorar e Recuperar Serviços.",
                "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-4-1-2",
                "name": "Executar e recuperar backups",
                "code": "TEC.4.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-113, OP-097).",
                "scopeBoundary": "Atividade do L3 TEC.4.1 Monitorar e Recuperar Serviços.",
                "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-4-1-3",
                "name": "Gerir incidentes de cibersegurança",
                "code": "TEC.4.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 TEC.4.1 Monitorar e Recuperar Serviços.",
                "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-tec-5",
        "name": "Sustentar Plataformas",
        "code": "TEC.5",
        "description": "Sustentar plataformas de dados e analytics.",
        "objective": "Sustentar plataformas de dados e analytics.",
        "valueProposition": "Plataformas disponíveis para processos críticos.",
        "scopeBoundary": "Compreende os L3: TEC.5.1 Sustentar Plataformas de Dados e Analytics. Insere-se no L1 TEC e se limita às atividades descritas nesses L3.",
        "inputs": "Chamados de suporte, logs e métricas, runbooks de sustentação, base de conhecimento; Chamados de suporte, logs da ferramenta, documentação do fornecedor, base de conhecimento. Fornecedores: Área interna.",
        "outputs": "Plataforma disponível e estável, incidentes resolvidos e registrados; Ferramenta disponível e estável, incidentes resolvidos e registrados.",
        "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados. Destinos: Áreas internas.",
        "responsible": "Tecnologia, Engenharia de Dados",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Disponibilidade",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Jobs falhados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Crítico: 1, Moderado: 1",
            "target": "—",
            "status": "critico"
          }
        ],
        "systems": [
          "Databricks",
          "Dataiku"
        ],
        "painPoints": [
          "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
          "Sem plano de contingência formal em 2 macroprocesso(s) (OP-117, OP-119)",
          "Dependência de terceiros: Databricks e AWS — indispensáveis para operação da plataforma",
          "Dataiku — fornecedor da ferramenta, indispensável para correções e suporte de produto"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-tec-5-1",
            "name": "Sustentar Plataformas de Dados e Analytics",
            "code": "TEC.5.1",
            "description": "Mantém disponibilidade das plataformas de dados e analytics.",
            "objective": "Mantém disponibilidade das plataformas de dados e analytics.",
            "valueProposition": "Manter a plataforma lakehouse disponível e estável, tratando incidentes e executando… / Manter a ferramenta Dataiku disponível e estável, tratando incidentes, atualizações e…",
            "scopeBoundary": "Atividades L4: Sustentar lakehouse; Sustentar Dataiku. Macroprocessos AS-IS: OP-117, OP-119.",
            "inputs": "Chamados de suporte, logs e métricas, runbooks de sustentação, base de conhecimento; Chamados de suporte, logs da ferramenta, documentação do fornecedor, base de conhecimento. Fornecedores: Área interna.",
            "outputs": "Plataforma disponível e estável, incidentes resolvidos e registrados; Ferramenta disponível e estável, incidentes resolvidos e registrados.",
            "stakeholders": "Áreas executoras: Tecnologia, Engenharia de Dados. Destinos: Áreas internas.",
            "responsible": "Tecnologia, Engenharia de Dados",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Diário",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Crítico: 1, Moderado: 1",
                "target": "—",
                "status": "critico"
              }
            ],
            "systems": [
              "Databricks",
              "Dataiku"
            ],
            "painPoints": [
              "1 de 2 macroprocessos classificados como Crítico/Muito Crítico",
              "Sem plano de contingência formal em 2 macroprocesso(s) (OP-117, OP-119)",
              "Dependência de terceiros: Databricks e AWS — indispensáveis para operação da plataforma",
              "Dataiku — fornecedor da ferramenta, indispensável para correções e suporte de produto"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-117, OP-119"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-tec-5-1-1",
                "name": "Sustentar lakehouse",
                "code": "TEC.5.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-117, OP-119).",
                "scopeBoundary": "Atividade do L3 TEC.5.1 Sustentar Plataformas de Dados e Analytics.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-tec-5-1-2",
                "name": "Sustentar Dataiku",
                "code": "TEC.5.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-117, OP-119).",
                "scopeBoundary": "Atividade do L3 TEC.5.1 Sustentar Plataformas de Dados e Analytics.",
                "responsible": "Tecnologia, Engenharia de Dados",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "anb-l1-fac",
    "name": "Gestão de Instalações",
    "code": "FAC",
    "domain": "Processo de Suporte",
    "category": "SUPPORT",
    "description": "Manter instalações, serviços gerais e controle de acesso físico.",
    "objective": "Manter instalações, serviços gerais e controle de acesso físico.",
    "valueProposition": "Ambiente seguro e funcional para colaboradores, associados e visitantes.",
    "scopeBoundary": "Serviços prediais (chamados, manutenção, copa) e segurança física e controle de acesso.",
    "inputs": "Chamados das áreas; contratos de manutenção; cadastro de visitantes.",
    "outputs": "Chamados atendidos; ambiente mantido; acessos controlados.",
    "stakeholders": "Facilities; fornecedores terceirizados. Destinos: colaboradores e visitantes.",
    "responsible": "Facilities",
    "businessUnit": "Processos de Suporte",
    "lastUpdate": "08 de Outubro de 2026",
    "documentationStatus": "in_progress",
    "contextValidationPercent": 100,
    "policies": [
      {
        "id": "anb-l1-fac-pol-1",
        "name": "Normas de segurança predial",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      },
      {
        "id": "anb-l1-fac-pol-2",
        "name": "contratos de serviços",
        "type": "Política Interna",
        "version": "—",
        "status": "vigente"
      }
    ],
    "explicitRelations": [],
    "indicators": [
      {
        "name": "SLA de chamados",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      },
      {
        "name": "Nº de incidentes de segurança física",
        "currentValue": "Sugerido",
        "target": "A definir",
        "status": "sem_dados"
      }
    ],
    "systems": [
      "Safekey",
      "Btime Gestão",
      "Intelligent Touch",
      "Invenzi",
      "pacote Microsoft 365 (Excel, Word, Outlook, Teams, SharePoint)",
      "TO-BE: Btime para chamados",
      "TO-BE: Safekey/Invenzi para acesso físico"
    ],
    "painPoints": [
      "Execução por terceiros",
      "Baixa criticidade mas impacto na experiência"
    ],
    "evidences": [],
    "openQuestions": [],
    "childrenL2": [
      {
        "id": "anb-l2-fac-1",
        "name": "Gerir Serviços Prediais",
        "code": "FAC.1",
        "description": "Gerir serviços prediais.",
        "objective": "Gerir serviços prediais.",
        "valueProposition": "Ambiente funcional.",
        "scopeBoundary": "Compreende os L3: FAC.1.1 Operar Serviços Gerais. Insere-se no L1 FAC e se limita às atividades descritas nesses L3.",
        "inputs": "Utiliza-se apenas a demanda solicitada ex: se for chmado de copa cai no sistema pedido…; Sistema através de link com limite de licença. Fornecedores: Área interna.",
        "outputs": "No caso de pedido de café,água consegue mensurar qual horario com mais demanda e…; Garantia de conforto a visitantes e colaboradores.",
        "stakeholders": "Áreas executoras: Facilities. Destinos: Áreas internas.",
        "responsible": "Facilities",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "SLA de chamados",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 2",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Btime Gestão",
          "Intelligent Touch"
        ],
        "painPoints": [
          "Sem plano de contingência formal em 1 macroprocesso(s) (OP-009)",
          "Procedimento não documentado ou só informal em OP-005"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-fac-1-1",
            "name": "Operar Serviços Gerais",
            "code": "FAC.1.1",
            "description": "Atende chamados operacionais e mantém condições do ambiente.",
            "objective": "Atende chamados operacionais e mantém condições do ambiente.",
            "valueProposition": "Garantir o atendimento e acompanhamento das solicitações de Facilities, contribuindo… / Garantir o funcionamento adequado dos sistemas de climatização, mantendo as condições…",
            "scopeBoundary": "Atividades L4: Gerir chamados e serviços operacionais; Gerir climatização dos ambientes; Planejar manutenção preventiva . Macroprocessos AS-IS: OP-005, OP-009.",
            "inputs": "Utiliza-se apenas a demanda solicitada ex: se for chmado de copa cai no sistema pedido…; Sistema através de link com limite de licença. Fornecedores: Área interna.",
            "outputs": "No caso de pedido de café,água consegue mensurar qual horario com mais demanda e…; Garantia de conforto a visitantes e colaboradores.",
            "stakeholders": "Áreas executoras: Facilities. Destinos: Áreas internas.",
            "responsible": "Facilities",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Btime Gestão",
              "Intelligent Touch"
            ],
            "painPoints": [
              "Sem plano de contingência formal em 1 macroprocesso(s) (OP-009)",
              "Procedimento não documentado ou só informal em OP-005"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-005, OP-009"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-fac-1-1-1",
                "name": "Gerir chamados e serviços operacionais",
                "code": "FAC.1.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-005, OP-009).",
                "scopeBoundary": "Atividade do L3 FAC.1.1 Operar Serviços Gerais.",
                "responsible": "Facilities",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-fac-1-1-2",
                "name": "Gerir climatização dos ambientes",
                "code": "FAC.1.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-005, OP-009).",
                "scopeBoundary": "Atividade do L3 FAC.1.1 Operar Serviços Gerais.",
                "responsible": "Facilities",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-fac-1-1-3",
                "name": "Planejar manutenção preventiva",
                "code": "FAC.1.1.3",
                "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                "scopeBoundary": "Atividade do L3 FAC.1.1 Operar Serviços Gerais.",
                "responsible": "Facilities",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "pending",
                "contextValidationPercent": 0,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      },
      {
        "id": "anb-l2-fac-2",
        "name": "Gerir Segurança Física e Acesso",
        "code": "FAC.2",
        "description": "Gerir segurança física e acesso.",
        "objective": "Gerir segurança física e acesso.",
        "valueProposition": "Ambiente seguro.",
        "scopeBoundary": "Compreende os L3: FAC.2.1 Controlar Acesso às Instalações. Insere-se no L1 FAC e se limita às atividades descritas nesses L3.",
        "inputs": "Documento pessoal solicitado no proprio aplicativo diretamente no celular do visitante…; Nome,cpf e empresa. Fornecedores: Fornecedor/prestador externo; Área interna.",
        "outputs": "Controle na segurança do acesso, restinge e gera relatorios; Acesso interno ao escritorio.",
        "stakeholders": "Áreas executoras: Facilities. Destinos: Áreas internas.",
        "responsible": "Facilities",
        "businessUnit": "Processos de Suporte",
        "lastUpdate": "08 de Outubro de 2026",
        "documentationStatus": "in_progress",
        "contextValidationPercent": 100,
        "policies": [],
        "explicitRelations": [],
        "indicators": [
          {
            "name": "Incidentes de acesso",
            "currentValue": "Sugerido",
            "target": "A definir",
            "status": "sem_dados"
          },
          {
            "name": "Criticidade declarada",
            "currentValue": "Baixo: 2",
            "target": "—",
            "status": "dentro_da_meta"
          }
        ],
        "systems": [
          "Microsoft Outlook",
          "Microsoft Teams",
          "Safekey",
          "Invenzi"
        ],
        "painPoints": [
          "Procedimento não documentado ou só informal em OP-006, OP-007"
        ],
        "evidences": [],
        "openQuestions": [],
        "childrenL3": [
          {
            "id": "anb-l3-fac-2-1",
            "name": "Controlar Acesso às Instalações",
            "code": "FAC.2.1",
            "description": "Controla entrada e circulação de colaboradores, visitantes e terceiros.",
            "objective": "Controla entrada e circulação de colaboradores, visitantes e terceiros.",
            "valueProposition": "Controlar e gerenciar as permissões de entrada e circulação de colaboradores e… / Controlar e gerenciar o acesso de pessoas às instalações da ANBIMA, garantindo a…",
            "scopeBoundary": "Atividades L4: Gerir acesso e circulação nas instalações; Gerir acesso aos escritórios. Macroprocessos AS-IS: OP-006, OP-007.",
            "inputs": "Documento pessoal solicitado no proprio aplicativo diretamente no celular do visitante…; Nome,cpf e empresa. Fornecedores: Fornecedor/prestador externo; Área interna.",
            "outputs": "Controle na segurança do acesso, restinge e gera relatorios; Acesso interno ao escritorio.",
            "stakeholders": "Áreas executoras: Facilities. Destinos: Áreas internas.",
            "responsible": "Facilities",
            "businessUnit": "Processos de Suporte",
            "lastUpdate": "08 de Outubro de 2026",
            "documentationStatus": "in_progress",
            "contextValidationPercent": 100,
            "policies": [],
            "explicitRelations": [],
            "indicators": [
              {
                "name": "% entregas no prazo/SLA",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Taxa de erro/retrabalho",
                "currentValue": "Sugerido",
                "target": "A definir",
                "status": "sem_dados"
              },
              {
                "name": "Frequência de execução",
                "currentValue": "Várias vezes ao dia",
                "target": "—",
                "status": "sem_dados"
              },
              {
                "name": "Criticidade declarada",
                "currentValue": "Baixo: 2",
                "target": "—",
                "status": "dentro_da_meta"
              }
            ],
            "systems": [
              "Microsoft Outlook",
              "Microsoft Teams",
              "Safekey",
              "Invenzi"
            ],
            "painPoints": [
              "Procedimento não documentado ou só informal em OP-006, OP-007"
            ],
            "evidences": [
              "Macroprocessos AS-IS vinculados: OP-006, OP-007"
            ],
            "openQuestions": [],
            "childrenL4": [
              {
                "id": "anb-l4-fac-2-1-1",
                "name": "Gerir acesso e circulação nas instalações",
                "code": "FAC.2.1.1",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-006, OP-007).",
                "scopeBoundary": "Atividade do L3 FAC.2.1 Controlar Acesso às Instalações.",
                "responsible": "Facilities",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              },
              {
                "id": "anb-l4-fac-2-1-2",
                "name": "Gerir acesso aos escritórios",
                "code": "FAC.2.1.2",
                "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-006, OP-007).",
                "scopeBoundary": "Atividade do L3 FAC.2.1 Controlar Acesso às Instalações.",
                "responsible": "Facilities",
                "businessUnit": "Processos de Suporte",
                "lastUpdate": "08 de Outubro de 2026",
                "documentationStatus": "in_progress",
                "contextValidationPercent": 100,
                "policies": [],
                "explicitRelations": [],
                "indicators": [],
                "systems": [],
                "painPoints": [],
                "evidences": [],
                "openQuestions": [],
                "processes": []
              }
            ]
          }
        ]
      }
    ]
  }
];

/** Árvore navegável da cadeia de valor (store). */
export function buildAnbimaValueChain(): L1Process[] {
  return [
    {
      "id": "anb-l1-s2e",
      "name": "Estratégia a Execução",
      "namePT": "Estratégia a Execução",
      "nameEN": "Strategy-to-Execution",
      "code": "S2E",
      "category": "SUPPORT",
      "businessUnit": "Processos de Gestão",
      "description": "Definir o direcionamento estratégico da ANBIMA, governar seus órgãos estatutários e desdobrar a estratégia em portfólio de iniciativas, metas, capacidades e conhecimento organizacional, garantindo que a associação atue de forma coerente com os interesses de associados, reguladores e mercado.",
      "responsible": "Jurídico, Representação de Mercados",
      "l2Processes": [
        {
          "id": "anb-l2-s2e-1",
          "name": "Definir Direcionamento Estratégico",
          "code": "S2E.1",
          "description": "Formular a estratégia institucional e assegurar o funcionamento da governança associativa.",
          "responsible": "Jurídico",
          "l3Processes": [
            {
              "id": "anb-l3-s2e-1-1",
              "name": "Formular Estratégia Institucional",
              "code": "S2E.1.1",
              "description": "Define propósito, posicionamento e plano estratégico plurianual da ANBIMA frente a associados, reguladores e mercado.",
              "responsible": "Dono a definir",
              "systems": "Power BI (sugerido), SharePoint (sugerido), Microsoft Copilot (pesquisa e síntese) (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-1-1-1",
                  "name": "Analisar ambiente regulatório, de mercado e tendências",
                  "code": "S2E.1.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-1-1-2",
                  "name": "Elaborar planejamento estratégico plurianual",
                  "code": "S2E.1.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-1-1-3",
                  "name": "Desdobrar estratégia em objetivos, metas e OKRs",
                  "code": "S2E.1.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-s2e-1-2",
              "name": "Gerir Governança Associativa",
              "code": "S2E.1.2",
              "description": "Suporta Assembleia, Conselho, Diretoria e comitês estatutários, e mantém atos e documentos de representação.",
              "responsible": "Jurídico",
              "systems": "Microsoft Excel, Microsoft SharePoint, Microsoft Word",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-091); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-1-2-1",
                  "name": "Secretariar Assembleia, Conselho e Diretoria",
                  "code": "S2E.1.2.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-1-2-2",
                  "name": "Gerir mandatos e composição dos órgãos estatutários",
                  "code": "S2E.1.2.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-1-2-3",
                  "name": "Gerir acervo de procurações, atas e documentos de representação",
                  "code": "S2E.1.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-091).",
                  "responsible": "Jurídico",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-s2e-2",
          "name": "Gerir Portfólio e Desempenho",
          "code": "S2E.2",
          "description": "Priorizar e acompanhar o portfólio de iniciativas estratégicas e medir o desempenho institucional.",
          "responsible": "A definir",
          "l3Processes": [
            {
              "id": "anb-l3-s2e-2-1",
              "name": "Gerir Portfólio de Projetos Estratégicos",
              "code": "S2E.2.1",
              "description": "Prioriza, acompanha e captura benefícios das iniciativas estratégicas.",
              "responsible": "Dono a definir",
              "systems": "ClickUp ou Jira (já presentes na casa) para portfólio (sugerido), Power BI (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-2-1-1",
                  "name": "Priorizar e aprovar portfólio de iniciativas",
                  "code": "S2E.2.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-2-1-2",
                  "name": "Acompanhar execução e benefícios do portfólio",
                  "code": "S2E.2.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-s2e-2-2",
              "name": "Monitorar Desempenho Institucional",
              "code": "S2E.2.2",
              "description": "Mede e reporta resultados institucionais à governança.",
              "responsible": "Dono a definir",
              "systems": "Power BI sobre Databricks (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-2-2-1",
                  "name": "Definir e manter painel de indicadores institucionais",
                  "code": "S2E.2.2.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-2-2-2",
                  "name": "Conduzir rituais de análise de resultados",
                  "code": "S2E.2.2.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-s2e-3",
          "name": "Gerir Capacidades e Conhecimento",
          "code": "S2E.3",
          "description": "Manter a arquitetura de processos e o conhecimento/acervo documental da associação.",
          "responsible": "Representação de Mercados",
          "l3Processes": [
            {
              "id": "anb-l3-s2e-3-1",
              "name": "Gerir Arquitetura de Processos",
              "code": "S2E.3.1",
              "description": "Mantém cadeia de valor, processos documentados e melhoria contínua.",
              "responsible": "Dono a definir",
              "systems": "Repositório de processos (Fluig BPM ou ferramenta de modelagem BPMN) (sugerido), SharePoint (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-3-1-1",
                  "name": "Manter cadeia de valor e arquitetura de processos",
                  "code": "S2E.3.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2e-3-1-2",
                  "name": "Documentar e melhorar processos",
                  "code": "S2E.3.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-s2e-3-2",
              "name": "Gerir Conhecimento e Acervo Documental",
              "code": "S2E.3.2",
              "description": "Organiza e preserva conteúdos e documentos corporativos.",
              "responsible": "Representação de Mercados",
              "systems": "Novo Sistema Organismos",
              "painPoints": "Procedimento não documentado ou só informal em OP-206; Dependência de terceiros: Microsoft",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2e-3-2-1",
                  "name": "Gerir documentos e conteúdos em repositórios corporativos",
                  "code": "S2E.3.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-206).",
                  "responsible": "Representação de Mercados",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-grc",
      "name": "Governança, Riscos e Conformidade",
      "namePT": "Governança, Riscos e Conformidade",
      "nameEN": "Govern-to-Comply",
      "code": "GRC",
      "category": "SUPPORT",
      "businessUnit": "Processos de Gestão",
      "description": "Proteger a associação por meio da gestão integrada de riscos corporativos, controles internos, continuidade de negócios, integridade, privacidade de dados e assuntos jurídicos, assegurando conformidade legal, regulatória e ética.",
      "responsible": "Compliance, Jurídico",
      "l2Processes": [
        {
          "id": "anb-l2-grc-1",
          "name": "Gerir Riscos e Controles",
          "code": "GRC.1",
          "description": "Identificar, avaliar e tratar riscos corporativos e garantir controles internos efetivos.",
          "responsible": "A definir",
          "l3Processes": [
            {
              "id": "anb-l3-grc-1-1",
              "name": "Gerir Riscos Corporativos",
              "code": "GRC.1.1",
              "description": "Identifica, avalia, trata e reporta riscos corporativos.",
              "responsible": "Dono a definir",
              "systems": "BeCompliance (módulo de riscos) (sugerido), Power BI (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-1-1-1",
                  "name": "Identificar e avaliar riscos corporativos",
                  "code": "GRC.1.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-1-1-2",
                  "name": "Monitorar riscos e planos de tratamento",
                  "code": "GRC.1.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-1-1-3",
                  "name": "Reportar riscos à governança",
                  "code": "GRC.1.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-grc-1-2",
              "name": "Gerir Controles Internos e Auditoria",
              "code": "GRC.1.2",
              "description": "Desenha e testa controles e coordena auditorias internas.",
              "responsible": "Dono a definir",
              "systems": "BeCompliance (controles e auditoria) (sugerido), SharePoint (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-1-2-1",
                  "name": "Desenhar e testar controles internos",
                  "code": "GRC.1.2.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-1-2-2",
                  "name": "Coordenar auditoria interna e tratar apontamentos",
                  "code": "GRC.1.2.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-grc-2",
          "name": "Gerir Continuidade e Resiliência",
          "code": "GRC.2",
          "description": "Garantir a continuidade dos macroprocessos críticos diante de incidentes.",
          "responsible": "A definir",
          "l3Processes": [
            {
              "id": "anb-l3-grc-2-1",
              "name": "Gerir Continuidade de Negócios",
              "code": "GRC.2.1",
              "description": "Analisa impacto, define contingências e testa a capacidade de recuperação dos macroprocessos críticos.",
              "responsible": "Dono a definir",
              "systems": "BeCompliance ou ferramenta de BCM (sugerido), plataforma de backup (TEC.4) (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-2-1-1",
                  "name": "Conduzir análise de impacto no negócio (BIA)",
                  "code": "GRC.2.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-2-1-2",
                  "name": "Definir estratégias e planos de contingência",
                  "code": "GRC.2.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-2-1-3",
                  "name": "Testar e manter planos de continuidade",
                  "code": "GRC.2.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-2-1-4",
                  "name": "Gerir crises e comunicação de crise",
                  "code": "GRC.2.1.4",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-grc-3",
          "name": "Gerir Integridade e Compliance",
          "code": "GRC.3",
          "description": "Manter o programa de integridade, monitorar condutas e assegurar a conformidade com a LGPD.",
          "responsible": "Compliance, Jurídico",
          "l3Processes": [
            {
              "id": "anb-l3-grc-3-1",
              "name": "Gerir Programa de Integridade",
              "code": "GRC.3.1",
              "description": "Mantém normativos, capacitação e cultura de integridade.",
              "responsible": "Compliance",
              "systems": "Microsoft Outlook, Microsoft SharePoint, Microsoft Word, BeCompliance, KnowBe4, Workvivo",
              "painPoints": "Sem plano de contingência formal em 4 macroprocesso(s) (OP-065, OP-067, OP-068, OP-069); Impactos/penalidades declarados: Não há penalidade formal; Aplicação de multa pela CGU; Dependência de terceiros: Sim, BeCompliance e KnoeBe4; Sim, Intertéia, WebDefense e KnowBe4",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-3-1-1",
                  "name": "Gerir documentos e normativos de integridade",
                  "code": "GRC.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-1-2",
                  "name": "Integrar colaboradores ao programa de integridade",
                  "code": "GRC.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-1-3",
                  "name": "Capacitar em integridade",
                  "code": "GRC.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-1-4",
                  "name": "Comunicar cultura de integridade",
                  "code": "GRC.3.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-065, OP-067, OP-068, OP-069).",
                  "responsible": "Compliance",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-grc-3-2",
              "name": "Monitorar Condutas e Riscos de Integridade",
              "code": "GRC.3.2",
              "description": "Monitora condutas, terceiros e riscos do programa de integridade.",
              "responsible": "Compliance",
              "systems": "BeCompliance, Microsoft Outlook, Portal ANBIMA, Jira, Microsoft SharePoint, Microsoft Word",
              "painPoints": "Sem plano de contingência formal em 4 macroprocesso(s) (OP-070, OP-071, OP-072, OP-073); Procedimento não documentado ou só informal em OP-066, OP-074; Dependência de terceiros: Sim, BeCompliance; Sistema Jira",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-3-2-1",
                  "name": "Gerir canal de denúncias",
                  "code": "GRC.3.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-2-2",
                  "name": "Monitorar interações com o poder público",
                  "code": "GRC.3.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-2-3",
                  "name": "Gerir cortesias, brindes e patrocínios",
                  "code": "GRC.3.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-2-4",
                  "name": "Gerir conflitos de interesse e defesa da concorrência",
                  "code": "GRC.3.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-2-5",
                  "name": "Avaliar terceiros, tecnologia e IA em contratações",
                  "code": "GRC.3.2.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-2-6",
                  "name": "Mapear e monitorar riscos de compliance",
                  "code": "GRC.3.2.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-066, OP-070, OP-071, OP-072, OP-073, OP-074).",
                  "responsible": "Compliance",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-grc-3-3",
              "name": "Gerir Privacidade e Proteção de Dados",
              "code": "GRC.3.3",
              "description": "Garante conformidade com a LGPD.",
              "responsible": "Compliance, Jurídico",
              "systems": "BeCompliance, Jira, Microsoft Excel, Microsoft SharePoint, Microsoft Word",
              "painPoints": "2 de 2 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-075, OP-089; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Aplicação de multa pela ANPD; Multa da LGPD se o titular dos dados se sentir prejudicado; Dependência de terceiros: Sim, BeCompliance (gestão de processos) e OpiceBlum (assessoria jurídica)",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-3-3-1",
                  "name": "Manter ROPA e programa de privacidade",
                  "code": "GRC.3.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-075, OP-089).",
                  "responsible": "Compliance, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-3-2",
                  "name": "Atender solicitações de titulares de dados",
                  "code": "GRC.3.3.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-075, OP-089).",
                  "responsible": "Compliance, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-grc-3-3-3",
                  "name": "Gerir incidentes de privacidade",
                  "code": "GRC.3.3.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Compliance, Jurídico",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-grc-4",
          "name": "Gerir Assuntos Jurídicos",
          "code": "GRC.4",
          "description": "Prestar consultoria jurídica e conduzir o contencioso da associação.",
          "responsible": "Jurídico",
          "l3Processes": [
            {
              "id": "anb-l3-grc-4-1",
              "name": "Prestar Consultoria Jurídica",
              "code": "GRC.4.1",
              "description": "Analisa contratos e documentos jurídicos da associação.",
              "responsible": "Jurídico",
              "systems": "Fluig, Microsoft Excel, Microsoft SharePoint, Microsoft Word, Netlex",
              "painPoints": "Procedimento não documentado ou só informal em OP-088; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: pode perder o fornecedor",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-4-1-1",
                  "name": "Analisar contratos, termos e documentos jurídicos",
                  "code": "GRC.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-088).",
                  "responsible": "Jurídico",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-grc-4-2",
              "name": "Gerir Contencioso",
              "code": "GRC.4.2",
              "description": "Conduz ações judiciais e administrativas.",
              "responsible": "Jurídico",
              "systems": "",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-094); Impactos/penalidades declarados: perder prazo - significa perdar a ação; Dependência de terceiros: Escritório externo pode ajudar demanda",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-grc-4-2-1",
                  "name": "Gerir contencioso judicial e administrativo",
                  "code": "GRC.4.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-094).",
                  "responsible": "Jurídico",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-i2a",
      "name": "Agenda a Representação",
      "namePT": "Agenda a Representação",
      "nameEN": "Issue-to-Advocacy",
      "code": "I2A",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Transformar a agenda regulatória e legislativa em posicionamentos construídos com os associados e defendidos junto a reguladores, poder público e organismos internacionais.",
      "responsible": "Assessoria Jurídica, Representação de Mercados",
      "l2Processes": [
        {
          "id": "anb-l2-i2a-1",
          "name": "Monitorar Agenda Regulatória",
          "code": "I2A.1",
          "description": "Monitorar legislação e regulação e priorizar temas de interesse do mercado.",
          "responsible": "Assessoria Jurídica, Representação de Mercados",
          "l3Processes": [
            {
              "id": "anb-l3-i2a-1-1",
              "name": "Monitorar e Analisar Temas",
              "code": "I2A.1.1",
              "description": "Acompanha legislação e regulação e prioriza temas de interesse do mercado.",
              "responsible": "Assessoria Jurídica, Representação de Mercados",
              "systems": "Brevo",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-210); Procedimento não documentado ou só informal em OP-081",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2a-1-1-1",
                  "name": "Acompanhar legislação e temas de interesse",
                  "code": "I2A.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-081, OP-210).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-1-1-2",
                  "name": "Priorizar agenda regulatória da associação",
                  "code": "I2A.1.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-1-1-3",
                  "name": "Disseminar informações regulatórias aos associados",
                  "code": "I2A.1.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-081, OP-210).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-i2a-2",
          "name": "Construir Posicionamento",
          "code": "I2A.2",
          "description": "Construir posicionamentos com os associados por meio dos organismos de representação.",
          "responsible": "Representação de Mercados, Assessoria Jurídica",
          "l3Processes": [
            {
              "id": "anb-l3-i2a-2-1",
              "name": "Gerir Organismos de Representação",
              "code": "I2A.2.1",
              "description": "Opera comitês, fóruns e grupos de trabalho com participantes do mercado.",
              "responsible": "Representação de Mercados, Assessoria Jurídica",
              "systems": "Novo Sistema Organismos, Open Metadata, Microsoft Excel, Microsoft PowerPoint, Microsoft SharePoint, Microsoft Word",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-211); Procedimento não documentado ou só informal em OP-204, OP-205, OP-211, OP-079; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Dependência de terceiros: Provedor do Sistema Organismos; Provedor do Novo Sistema Organismos (Orla)",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2a-2-1-1",
                  "name": "Gerir sistema de organismos de representação",
                  "code": "I2A.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-204, OP-205, OP-211, OP-079).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-2-1-2",
                  "name": "Implantar e gerir novo sistema de organismos",
                  "code": "I2A.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-204, OP-205, OP-211, OP-079).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-2-1-3",
                  "name": "Gerir e consultar informações dos organismos",
                  "code": "I2A.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-211; OP-079).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-i2a-2-2",
              "name": "Conduzir Discussões com Associados",
              "code": "I2A.2.2",
              "description": "Realiza reuniões, registra deliberações e consolida posições.",
              "responsible": "Representação de Mercados, Assessoria Jurídica",
              "systems": "Microsoft Teams, Microsoft Copilot, Microsoft Outlook, Microsoft SharePoint, Novo Sistema Organismos",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-209); Procedimento não documentado ou só informal em OP-076; Dependência de terceiros: Microsoft",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2a-2-2-1",
                  "name": "Agendar e conduzir reuniões com associados",
                  "code": "I2A.2.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-209, OP-076).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-2-2-2",
                  "name": "Registrar reuniões e atas",
                  "code": "I2A.2.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-209, OP-076).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-2-2-3",
                  "name": "Consolidar posicionamento do mercado",
                  "code": "I2A.2.2.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Representação de Mercados, Assessoria Jurídica",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-i2a-3",
          "name": "Representar Institucionalmente",
          "code": "I2A.3",
          "description": "Representar a associação perante reguladores, poder público e organismos internacionais.",
          "responsible": "Assessoria Jurídica, Representação de Mercados",
          "l3Processes": [
            {
              "id": "anb-l3-i2a-3-1",
              "name": "Defender Posições junto a Reguladores e Poder Público",
              "code": "I2A.3.1",
              "description": "Formaliza e defende posições junto a CVM, Bacen, Legislativo e demais autoridades.",
              "responsible": "Assessoria Jurídica, Representação de Mercados",
              "systems": "Microsoft Excel, Microsoft PowerPoint, Microsoft SharePoint, Microsoft Word, Portal de Documentos (PDTec / PDSign), BeCompliance, Sistema interno de registro de ofícios",
              "painPoints": "1 de 4 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-203); Procedimento não documentado ou só informal em OP-078, OP-203, OP-077, OP-202; Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: A possível penalidade é o não aceite das manifestações da associação (caso haja prazo…; dependência de terceiros: Assinatura: PDSign; Númeração: desconhecido; Se tiver alguma indisposição ou erro na…; BeCompliance",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2a-3-1-1",
                  "name": "Elaborar, protocolar e assinar ofícios",
                  "code": "I2A.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-078; OP-203).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-3-1-2",
                  "name": "Responder audiências e consultas públicas",
                  "code": "I2A.3.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-3-1-3",
                  "name": "Registrar e reportar agendas externas",
                  "code": "I2A.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-077; OP-202).",
                  "responsible": "Assessoria Jurídica, Representação de Mercados",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-i2a-3-2",
              "name": "Atuar Internacionalmente",
              "code": "I2A.3.2",
              "description": "Representa a associação em fóruns e organismos internacionais.",
              "responsible": "Representação de Mercados",
              "systems": "Microsoft Excel, Microsoft PowerPoint, Microsoft Word, Microsoft Outlook, Portal ANBIMA",
              "painPoints": "Procedimento não documentado ou só informal em OP-215, OP-214; Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2a-3-2-1",
                  "name": "Participar de fóruns e cooperação internacional",
                  "code": "I2A.3.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-215, OP-214).",
                  "responsible": "Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2a-3-2-2",
                  "name": "Publicar conteúdo institucional internacional",
                  "code": "I2A.3.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-215, OP-214).",
                  "responsible": "Representação de Mercados",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-r2e",
      "name": "Regra a Supervisão",
      "namePT": "Regra a Supervisão",
      "nameEN": "Rule-to-Enforcement",
      "code": "R2E",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Executar o ciclo completo de autorregulação: criar e manter regras, admitir e credenciar participantes, supervisionar e inspecionar o mercado e aplicar sanções, assegurando a aderência às melhores práticas.",
      "responsible": "Jurídico, Representação de Mercados, Credenciamento, Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
      "l2Processes": [
        {
          "id": "anb-l2-r2e-1",
          "name": "Elaborar e Manter Autorregulação",
          "code": "R2E.1",
          "description": "Elaborar, revisar e publicar códigos e regras de autorregulação.",
          "responsible": "Jurídico, Representação de Mercados",
          "l3Processes": [
            {
              "id": "anb-l3-r2e-1-1",
              "name": "Desenvolver Códigos e Regras",
              "code": "R2E.1.1",
              "description": "Elabora, revisa e publica códigos de autorregulação e melhores práticas.",
              "responsible": "Jurídico, Representação de Mercados",
              "systems": "Microsoft Excel, Microsoft Outlook, Microsoft SharePoint, Microsoft Word, Portal ANBIMA",
              "painPoints": "Sem plano de contingência formal em 2 macroprocesso(s) (OP-093, OP-212); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Dependência de terceiros: Lumis, indispensável para a administração e publicação dos conteúdos no website da ANBIMA",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-1-1-1",
                  "name": "Identificar necessidade de nova regra ou revisão",
                  "code": "R2E.1.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Jurídico, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-1-1-2",
                  "name": "Elaborar e revisar códigos de autorregulação",
                  "code": "R2E.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-093, OP-212).",
                  "responsible": "Jurídico, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-1-1-3",
                  "name": "Submeter regras a audiência com associados",
                  "code": "R2E.1.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Jurídico, Representação de Mercados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-1-1-4",
                  "name": "Publicar guias técnicos e de melhores práticas",
                  "code": "R2E.1.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-093, OP-212).",
                  "responsible": "Jurídico, Representação de Mercados",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2e-2",
          "name": "Admitir e Credenciar Participantes",
          "code": "R2E.2",
          "description": "Admitir, manter e habilitar instituições e participantes.",
          "responsible": "Credenciamento",
          "l3Processes": [
            {
              "id": "anb-l3-r2e-2-1",
              "name": "Admitir Instituições",
              "code": "R2E.2.1",
              "description": "Gerencia entrada, manutenção cadastral, selos e saída de instituições.",
              "responsible": "Credenciamento",
              "systems": "Microsoft Excel, Microsoft PowerPoint, Microsoft Word, SSM, Microsoft SharePoint, Neoway, Open Metadata",
              "painPoints": "1 de 4 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 3 macroprocesso(s) (OP-084, OP-085, OP-086); Dependência de pessoa-chave em OP-087, OP-086; Procedimento não documentado ou só informal em OP-087; Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Não há; Dependência de terceiros: Target Law - escritório jurídico",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-2-1-1",
                  "name": "Processar adesão e filiação",
                  "code": "R2E.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                  "responsible": "Credenciamento",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-2-1-2",
                  "name": "Processar alteração cadastral",
                  "code": "R2E.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                  "responsible": "Credenciamento",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-2-1-3",
                  "name": "Gerir troca de selo",
                  "code": "R2E.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                  "responsible": "Credenciamento",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-2-1-4",
                  "name": "Processar cancelamento",
                  "code": "R2E.2.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-084, OP-085, OP-087, OP-086).",
                  "responsible": "Credenciamento",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-r2e-2-2",
              "name": "Habilitar Participantes (Convênio CVM)",
              "code": "R2E.2.2",
              "description": "Habilita pessoas físicas e jurídicas no âmbito do convênio CVM-ANBIMA.",
              "responsible": "Credenciamento",
              "systems": "Microsoft Excel, Microsoft PowerPoint, Microsoft SharePoint, Microsoft Word, Neoway, SSM",
              "painPoints": "2 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-082, OP-083); Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Autorização compulsória de um requerente; Dependência de terceiros: Target Law - escritório jurídico",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-2-2-1",
                  "name": "Habilitar pessoa física",
                  "code": "R2E.2.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-082, OP-083).",
                  "responsible": "Credenciamento",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-2-2-2",
                  "name": "Habilitar pessoa jurídica",
                  "code": "R2E.2.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-082, OP-083).",
                  "responsible": "Credenciamento",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2e-3",
          "name": "Supervisionar Mercado",
          "code": "R2E.3",
          "description": "Supervisionar o mercado com base em risco, monitorar participantes e aplicar sanções.",
          "responsible": "Supervisão de Mercados, Plataforma de operações, Jurídico, Business Analytics, Fundos",
          "l3Processes": [
            {
              "id": "anb-l3-r2e-3-1",
              "name": "Planejar Supervisão Baseada em Risco",
              "code": "R2E.3.1",
              "description": "Define prioridades e plano anual de supervisão.",
              "responsible": "Dono a definir",
              "systems": "SSM (sugerido), Databricks/Power BI (matriz de risco) (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-3-1-1",
                  "name": "Elaborar plano de supervisão baseada em risco",
                  "code": "R2E.3.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-r2e-3-2",
              "name": "Monitorar Participantes e Produtos",
              "code": "R2E.3.2",
              "description": "Monitora dados, enquadramento e eventos com apoio de analytics.",
              "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
              "systems": "Databricks, Cognito, AWS, Nexxus, RDS ANBIMA, Dataiku, Power BI",
              "painPoints": "1 de 6 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 3 macroprocesso(s) (OP-217, OP-218, OP-130); Procedimento não documentado ou só informal em OP-216, OP-220, OP-221; Dependência de terceiros: Nexxus, AWS; Databricks",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-3-2-1",
                  "name": "Desenvolver e suportar analytics de supervisão",
                  "code": "R2E.3.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-2-2",
                  "name": "Processar enquadramento de fundos",
                  "code": "R2E.3.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-2-3",
                  "name": "Consumir e tratar bases internas para supervisão",
                  "code": "R2E.3.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-2-4",
                  "name": "Automatizar rotinas de supervisão (RPA)",
                  "code": "R2E.3.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-2-5",
                  "name": "Monitorar eventos episódicos e exposição do mercado",
                  "code": "R2E.3.2.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-2-6",
                  "name": "Cobrar qualidade das informações enviadas",
                  "code": "R2E.3.2.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-216, OP-217, OP-218, OP-220, OP-221, OP-130).",
                  "responsible": "Supervisão de Mercados, Plataforma de operações, Business Analytics, Fundos",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-r2e-3-3",
              "name": "Conduzir Processos e Aplicar Sanções",
              "code": "R2E.3.3",
              "description": "Instrui processos, aplica penalidades e acompanha seu cumprimento.",
              "responsible": "Jurídico, Plataforma de operações, Fundos",
              "systems": "Microsoft Excel, Microsoft Outlook, Microsoft SharePoint, Microsoft Word, Databricks, SSM",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-092, OP-131); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-3-3-1",
                  "name": "Revisar processos de autorregulação",
                  "code": "R2E.3.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-092, OP-131).",
                  "responsible": "Jurídico, Plataforma de operações, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-3-2",
                  "name": "Instaurar processos e celebrar termos de compromisso",
                  "code": "R2E.3.3.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Jurídico, Plataforma de operações, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-3-3-3",
                  "name": "Aplicar multas e penalidades",
                  "code": "R2E.3.3.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-092, OP-131).",
                  "responsible": "Jurídico, Plataforma de operações, Fundos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2e-4",
          "name": "Inspecionar o Mercado",
          "code": "R2E.4",
          "description": "Inspecionar instituições participantes de forma periódica e temática (novo L2).",
          "responsible": "A definir",
          "l3Processes": [
            {
              "id": "anb-l3-r2e-4-1",
              "name": "Conduzir Inspeções",
              "code": "R2E.4.1",
              "description": "Planeja e executa inspeções periódicas e temáticas (in loco e remotas) nas instituições participantes, verificando a aderência aos códigos e regras de autorregulação.",
              "responsible": "Dono a definir",
              "systems": "SSM (extensão para inspeções) ou módulo dedicado (sugerido), SharePoint para evidências (sugerido), Power BI (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2e-4-1-1",
                  "name": "Planejar ciclo de inspeções periódicas e temáticas",
                  "code": "R2E.4.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-4-1-2",
                  "name": "Executar inspeções in loco e remotas",
                  "code": "R2E.4.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2e-4-1-3",
                  "name": "Emitir relatório de inspeção e acompanhar planos de ação",
                  "code": "R2E.4.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-c2p",
      "name": "Coleta a Publicação",
      "namePT": "Coleta a Publicação",
      "nameEN": "Collect-to-Publish",
      "code": "C2P",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Coletar e validar dados de mercado e transformá-los em preços, curvas, índices, estatísticas, rankings e produtos de dados de referência, distribuídos com qualidade e pontualidade ao mercado.",
      "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição, Preços, Índices e Modelagens, Representação de Mercados, Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
      "l2Processes": [
        {
          "id": "anb-l2-c2p-1",
          "name": "Coletar e Validar Dados de Mercado",
          "code": "C2P.1",
          "description": "Coletar e validar dados de fundos, carteiras, mercado de capitais e distribuição.",
          "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
          "l3Processes": [
            {
              "id": "anb-l3-c2p-1-1",
              "name": "Coletar Informações de Fundos e Carteiras",
              "code": "C2P.1.1",
              "description": "Recebe, depura e valida informações periódicas de fundos e carteiras administradas.",
              "responsible": "Plataforma de operações, Fundos",
              "systems": "Hub ANBIMA, ANBIMA Input, Databricks, Dataiku, Open Metadata, SSM",
              "painPoints": "4 de 4 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 3 macroprocesso(s) (OP-139, OP-140, OP-129); Impactos/penalidades declarados: Multa para a instituição, conforme descrito em código; Dependência de terceiros: RTM - Desenvolvedora do HUB ANBIMA; Dataiku e Databricks: execução das depurações; Neoway: preenchimento automático de…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-1-1-1",
                  "name": "Receber informações periódicas de fundos (PL/cota)",
                  "code": "C2P.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                  "responsible": "Plataforma de operações, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-1-2",
                  "name": "Receber informações periódicas via ANBIMA Input",
                  "code": "C2P.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                  "responsible": "Plataforma de operações, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-1-3",
                  "name": "Executar rotinas do Hub ANBIMA",
                  "code": "C2P.1.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                  "responsible": "Plataforma de operações, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-1-4",
                  "name": "Depurar carteiras administradas, IE e FIP",
                  "code": "C2P.1.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-139, OP-140, OP-129, OP-135).",
                  "responsible": "Plataforma de operações, Fundos",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-1-2",
              "name": "Coletar Dados de Mercado de Capitais e Distribuição",
              "code": "C2P.1.2",
              "description": "Credencia e valida bases de mercado de capitais e distribuição.",
              "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
              "systems": "ANBIMA Data, ANBIMA Input, ARC, Sistema de distribuição (Envio de dados), RPA, Debêntures",
              "painPoints": "4 de 5 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 5 macroprocesso(s) (OP-143, OP-142, OP-144, OP-146, OP-147); Dependência de terceiros: B3; Accenture; B3, representa 99% dos dados enviados",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-1-2-1",
                  "name": "Credenciar base de secundário de debêntures",
                  "code": "C2P.1.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                  "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-2-2",
                  "name": "Monitorar prévia do REUNE",
                  "code": "C2P.1.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                  "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-2-3",
                  "name": "Depurar dados de distribuição (Private, Varejo, Gestão de Patrimônio)",
                  "code": "C2P.1.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                  "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-2-4",
                  "name": "Coletar documentos para preços e índices",
                  "code": "C2P.1.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                  "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-1-2-5",
                  "name": "Validar debentures.com.br",
                  "code": "C2P.1.2.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-143, OP-142, OP-144, OP-146, OP-147).",
                  "responsible": "Plataforma de operações, Mercados de Capitais e Distribuição",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-c2p-2",
          "name": "Precificar Ativos e Calcular Curvas",
          "code": "C2P.2",
          "description": "Precificar títulos públicos e privados, calcular curvas e gerir insumos de precificação.",
          "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
          "l3Processes": [
            {
              "id": "anb-l3-c2p-2-1",
              "name": "Precificar Títulos Públicos",
              "code": "C2P.2.1",
              "description": "Calcula e divulga taxas, preços e referências de títulos públicos.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "NAI, Microsoft Excel, Sistema call corretores, Sistema interno - SUP públicos, FTP SELIC/BCB, Rundeck",
              "painPoints": "4 de 4 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-151, OP-156); Procedimento não documentado ou só informal em OP-159, OP-178; Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Exposição pública / dano de imagem; Dependência de terceiros: Provedores de preços; IBGE / FGV / BACEN",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-2-1-1",
                  "name": "Calcular e divulgar preços de títulos públicos",
                  "code": "C2P.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-1-2",
                  "name": "Divulgar prévia ANBIMA 12h",
                  "code": "C2P.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-1-3",
                  "name": "Calcular VNA de títulos públicos",
                  "code": "C2P.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-1-4",
                  "name": "Divulgar PU 550/238",
                  "code": "C2P.2.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-151, OP-156, OP-159, OP-178).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-2-2",
              "name": "Precificar Títulos Privados",
              "code": "C2P.2.2",
              "description": "Calcula e divulga taxas e preços indicativos de crédito privado.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "ARC, Sistema interno - SUP privados, Debêntures, Sistema call corretores, Databricks, Brevo, Microsoft Outlook",
              "painPoints": "6 de 6 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 6 macroprocesso(s) (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161); Impactos/penalidades declarados: Exposição pública / dano de imagem; Falta de informação ao mercado, e falta de referência de preço para ativos privados…; Dependência de terceiros: Provedores de preços, B3; Provedores de preços",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-2-2-1",
                  "name": "Precificar debêntures",
                  "code": "C2P.2.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-2-2",
                  "name": "Precificar FIDC",
                  "code": "C2P.2.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-2-3",
                  "name": "Precificar Letras Financeiras",
                  "code": "C2P.2.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-2-4",
                  "name": "Precificar CRA/CRI",
                  "code": "C2P.2.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-2-5",
                  "name": "Calcular e divulgar Z-spread",
                  "code": "C2P.2.2.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-2-6",
                  "name": "Calcular vértices NTN-B para títulos privados",
                  "code": "C2P.2.2.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-150, OP-152, OP-153, OP-154, OP-155, OP-161).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-2-3",
              "name": "Calcular Curvas de Referência",
              "code": "C2P.2.3",
              "description": "Calcula curvas de juros, inflação implícita e crédito.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "Microsoft Excel, NAI, MATLAB, Rundeck",
              "painPoints": "2 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-158, OP-177); Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Exposição pública / dano de imagem; Dependência de terceiros: Provedores de preços; Matlab",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-2-3-1",
                  "name": "Calcular curvas ETTJ (pré, IPCA e inflação implícita)",
                  "code": "C2P.2.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-158, OP-177).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-3-2",
                  "name": "Calcular e divulgar curvas de crédito",
                  "code": "C2P.2.3.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-158, OP-177).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-2-4",
              "name": "Gerir Insumos e Ferramentas de Precificação",
              "code": "C2P.2.4",
              "description": "Gerencia contribuidores de taxas e ferramentas de cálculo abertas ao mercado.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "Microsoft Excel, SUP, ANBIMA Data, ARC, NAI",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-157); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Falta de informação ao mercado, e falta de referência de preço para validação das…; Exposição pública / dano de imagem; Dependência de terceiros: Corretoras de valores; Agentes Fiduciários, Tesouro nacional",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-2-4-1",
                  "name": "Consolidar e divulgar call das corretoras",
                  "code": "C2P.2.4.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-160, OP-157).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-4-2",
                  "name": "Manter calculadora de títulos públicos, debêntures e CRI/CRA",
                  "code": "C2P.2.4.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-160, OP-157).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-2-4-3",
                  "name": "Gerir painel de contribuidores de taxas",
                  "code": "C2P.2.4.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-c2p-3",
          "name": "Calcular e Administrar Índices",
          "code": "C2P.3",
          "description": "Calcular, rebalancear e governar índices e carteiras teóricas.",
          "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
          "l3Processes": [
            {
              "id": "anb-l3-c2p-3-1",
              "name": "Calcular Índices de Renda Fixa",
              "code": "C2P.3.1",
              "description": "Calcula diariamente as famílias de índices de renda fixa.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "Rundeck, Microsoft Excel, Python, NAI",
              "painPoints": "6 de 6 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 6 macroprocesso(s) (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173); Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Multa; Dependência de terceiros: Dados armazenados na AWS; Accenture - View ARC",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-3-1-1",
                  "name": "Calcular família IMA",
                  "code": "C2P.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-1-2",
                  "name": "Calcular família IDKA",
                  "code": "C2P.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-1-3",
                  "name": "Calcular família IDA",
                  "code": "C2P.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-1-4",
                  "name": "Calcular família IDA LIQ",
                  "code": "C2P.3.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-1-5",
                  "name": "Calcular ILFA",
                  "code": "C2P.3.1.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-1-6",
                  "name": "Calcular índices customizados (TD 2035/2050/2060)",
                  "code": "C2P.3.1.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-163, OP-162, OP-167, OP-170, OP-174, OP-173).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-3-2",
              "name": "Calcular Índices de Fundos",
              "code": "C2P.3.2",
              "description": "Calcula índices de referência da indústria de fundos.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "Microsoft Excel, Rundeck",
              "painPoints": "1 de 1 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-165); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Dependência de terceiros: Dados armazenados na AWS",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-3-2-1",
                  "name": "Calcular IHFA",
                  "code": "C2P.3.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-165).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-3-3",
              "name": "Rebalancear Carteiras Teóricas",
              "code": "C2P.3.3",
              "description": "Divulga prévias e rebalanceia carteiras teóricas dos índices.",
              "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
              "systems": "Rundeck, Microsoft Excel, NAI, Python",
              "painPoints": "8 de 8 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 8 macroprocesso(s) (OP-164, OP-169, OP-172, OP-176, OP-166, OP-168, OP-171, OP-175); Uso de Excel em etapas operacionais (4 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Multa; Dependência de terceiros: Dados armazenados na AWS; Accenture - View ARC",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-3-3-1",
                  "name": "Divulgar prévia de carteira (IMA, IDA, IDA LIQ, ILFA)",
                  "code": "C2P.3.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-164; OP-169; OP-172; OP-176).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-3-2",
                  "name": "Rebalancear carteiras (IHFA, IDA, IDA LIQ, ILFA)",
                  "code": "C2P.3.3.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-166; OP-168; OP-171; OP-175).",
                  "responsible": "Plataforma de operações, Preços, Índices e Modelagens",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-3-4",
              "name": "Governar Metodologias de Benchmarks",
              "code": "C2P.3.4",
              "description": "Garante governança, transparência e controle das metodologias, conforme princípios IOSCO.",
              "responsible": "Dono a definir",
              "systems": "OpenMetadata (linhagem) (sugerido), SharePoint (metodologias) (sugerido), Jira (comitê/controle de mudanças) (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-3-4-1",
                  "name": "Manter e revisar metodologias de preços e índices",
                  "code": "C2P.3.4.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-4-2",
                  "name": "Operar comitê de supervisão de benchmarks",
                  "code": "C2P.3.4.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-3-4-3",
                  "name": "Tratar contestações, erros e republicações",
                  "code": "C2P.3.4.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-c2p-4",
          "name": "Produzir Estatísticas e Rankings",
          "code": "C2P.4",
          "description": "Produzir estatísticas, rankings, boletins e projeções.",
          "responsible": "Plataforma de operações, Representação de Mercados, Fundos, Mercados de Capitais e Distribuição",
          "l3Processes": [
            {
              "id": "anb-l3-c2p-4-1",
              "name": "Produzir Rankings",
              "code": "C2P.4.1",
              "description": "Elabora rankings de fundos e mercado de capitais.",
              "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
              "systems": "Fundos, Microsoft PowerPoint, Databricks, Dataiku, Sistema de Ranking (Envio de dados), Cognito",
              "painPoints": "4 de 5 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 5 macroprocesso(s) (OP-132, OP-133, OP-134, OP-148, OP-149)",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-4-1-1",
                  "name": "Elaborar rankings de fundos (SQ, gestão e administração, global)",
                  "code": "C2P.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-132; OP-133; OP-134).",
                  "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-4-1-2",
                  "name": "Elaborar rankings de mercado de capitais (local e externo)",
                  "code": "C2P.4.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-148; OP-149).",
                  "responsible": "Plataforma de operações, Fundos, Mercados de Capitais e Distribuição",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-4-2",
              "name": "Produzir Boletins, Relatórios e Projeções",
              "code": "C2P.4.2",
              "description": "Publica boletins, relatórios e projeções macroeconômicas.",
              "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
              "systems": "Hub ANBIMA, Microsoft SharePoint, Power BI, Brevo, Microsoft Excel",
              "painPoints": "4 de 4 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-213; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Exposição pública / dano de imagem (não há penalidade financeira/contratual…; dependência de terceiros: PowerBI: execução das consultas pra gerar os relatórios Sharepoint: Planilhas internas; Lumis (provedor do website ANBIMA) - indispensável para a publicação da projeção no…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-4-2-1",
                  "name": "Elaborar boletim de fundos",
                  "code": "C2P.4.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                  "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-4-2-2",
                  "name": "Elaborar relatório diário de fundos",
                  "code": "C2P.4.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                  "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-4-2-3",
                  "name": "Elaborar relatórios diversos de fundos",
                  "code": "C2P.4.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                  "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-4-2-4",
                  "name": "Consolidar e divulgar projeções de IPCA e IGP-M",
                  "code": "C2P.4.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-136, OP-137, OP-138, OP-213).",
                  "responsible": "Plataforma de operações, Representação de Mercados, Fundos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-c2p-5",
          "name": "Desenvolver e Distribuir Produtos de Dados",
          "code": "C2P.5",
          "description": "Desenvolver, distribuir e dar suporte a produtos de dados.",
          "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
          "l3Processes": [
            {
              "id": "anb-l3-c2p-5-1",
              "name": "Gerir Portfólio de Produtos de Dados",
              "code": "C2P.5.1",
              "description": "Define estratégia e desenvolve produtos de dados ao mercado.",
              "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
              "systems": "Databricks, ANBIMA Data, ANBIMA Feed, ClickUp, Jira, Microsoft Teams",
              "painPoints": "Sem plano de contingência formal em 3 macroprocesso(s) (OP-111, OP-124, OP-126); Impactos/penalidades declarados: Não há penalidade formal; Dependência de terceiros: Databricks e AWS — indispensáveis para desenvolvimento e hospedagem; Sim -fornecedores de produtos de dados (dataviz e designer) e fornecedores de…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-5-1-1",
                  "name": "Definir estratégia e portfólio de produtos de dados",
                  "code": "C2P.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-5-1-2",
                  "name": "Desenvolver produto de dados",
                  "code": "C2P.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-5-1-3",
                  "name": "Desenvolver demandas pontuais de dados",
                  "code": "C2P.5.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-111, OP-124, OP-126).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-5-2",
              "name": "Distribuir Dados ao Mercado",
              "code": "C2P.5.2",
              "description": "Disponibiliza e sustenta os canais de distribuição (ANBIMA Data, Feed, Galgo).",
              "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
              "systems": "Databricks, ANBIMA Data, ANBIMA Feed, Hub Fundos (Galgo), Power Automate",
              "painPoints": "2 de 4 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-114, OP-115); Dependência de pessoa-chave em OP-102; Procedimento não documentado ou só informal em OP-125, OP-102; Impactos/penalidades declarados: Exposição pública / dano de imagem; Não há penalidade formal; Dependência de terceiros: Databricks e AWS — indispensáveis para processamento e entrega dos dados; Sim - fornecedor de sustentação/desenvolvimento",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-5-2-1",
                  "name": "Integrar ANBIMA Data/Feed",
                  "code": "C2P.5.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-5-2-2",
                  "name": "Sustentar produto de dados",
                  "code": "C2P.5.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-5-2-3",
                  "name": "Sustentar processamento de preços e índices",
                  "code": "C2P.5.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                  "status": "active"
                },
                {
                  "id": "anb-l4-c2p-5-2-4",
                  "name": "Processar dados intermediários Galgo",
                  "code": "C2P.5.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-114, OP-125, OP-115, OP-102).",
                  "responsible": "Tecnologia, Engenharia de Dados, Produtos de dados e IA, Soluções Digitais II",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-c2p-5-3",
              "name": "Atender Consumidores de Dados",
              "code": "C2P.5.3",
              "description": "Esclarece dúvidas de usuários de produtos de dados.",
              "responsible": "Tecnologia, Produtos de dados e IA",
              "systems": "ANBIMA Feed, Microsoft Outlook, Microsoft Teams",
              "painPoints": "1 de 1 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-128; Impactos/penalidades declarados: Não há penalidade formal",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-c2p-5-3-1",
                  "name": "Atender dúvidas sobre ANBIMA Data e Feed",
                  "code": "C2P.5.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-128).",
                  "responsible": "Tecnologia, Produtos de dados e IA",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-e2c",
      "name": "Educar a Certificar",
      "namePT": "Educar a Certificar",
      "nameEN": "Learn-to-Certify",
      "code": "E2C",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Desenhar, aplicar e manter as certificações profissionais ANBIMA e promover educação continuada e financeira, garantindo profissionais qualificados para o mercado.",
      "responsible": "Educação, Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
      "l2Processes": [
        {
          "id": "anb-l2-e2c-1",
          "name": "Desenhar Certificações",
          "code": "E2C.1",
          "description": "Desenhar certificações e manter o banco de questões.",
          "responsible": "Educação",
          "l3Processes": [
            {
              "id": "anb-l3-e2c-1-1",
              "name": "Definir Escopo e Requisitos",
              "code": "E2C.1.1",
              "description": "Define portfólio, requisitos e documentação técnico-normativa das certificações.",
              "responsible": "Educação",
              "systems": "Microsoft SharePoint, Portal ANBIMA",
              "painPoints": "1 de 1 macroprocessos classificados como Crítico/Muito Crítico; Impactos/penalidades declarados: Não há penalidade formal direta, mas risco de contestação/judicialização por…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-1-1-1",
                  "name": "Revisar portfólio de certificações",
                  "code": "E2C.1.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-1-1-2",
                  "name": "Elaborar documento de orientações técnicas das certificações",
                  "code": "E2C.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-201).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-e2c-1-2",
              "name": "Gerir Banco de Questões",
              "code": "E2C.1.2",
              "description": "Mantém matriz de avaliação e itens de prova.",
              "responsible": "Educação",
              "systems": "ANBIMA Edu, Plataforma da Cesgranrio (Saúde do Banco de Itens)",
              "painPoints": "1 de 1 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-195; Impactos/penalidades declarados: Anulação de exames; Cancelamento de certificações obtidas de forma fraudulenta; …; Dependência de terceiros: Sim - Cesgranrio, aplicadora responsável pelos dados e estatísticas psicométricas dos…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-1-2-1",
                  "name": "Gerir banco de questões e matriz de avaliação",
                  "code": "E2C.1.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-195).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-e2c-2",
          "name": "Aplicar Exames",
          "code": "E2C.2",
          "description": "Aplicar exames com integridade e julgar recursos.",
          "responsible": "Educação",
          "l3Processes": [
            {
              "id": "anb-l3-e2c-2-1",
              "name": "Operar Exames e Garantir Integridade",
              "code": "E2C.2.1",
              "description": "Aplica exames, detecta fraudes e julga recursos.",
              "responsible": "Educação",
              "systems": "ANBIMA Edu, API de agendamento (FGV e Cesgranrio), Plataforma de aplicação (Cesgranrio), Microsoft Excel, Plataforma de aplicação (Cesgranrio) - monitoramento remoto/IA e fiscalização",
              "painPoints": "3 de 3 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-196); Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Descumprimento do Edital/Código de Autorregulação; Risco de judicialização por parte…; Anulação de exames; Cancelamento de certificações; Suspensão de novos exames; Medidas…; Dependência de terceiros: Sim - FGV e Cesgranrio, instituições contratadas responsáveis pela aplicação…; Sim - Cesgranrio e FGV, responsáveis pela fiscalização presencial/remota e pelas…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-2-1-1",
                  "name": "Aplicar e gerir exames de certificação",
                  "code": "E2C.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-2-1-2",
                  "name": "Detectar fraudes proativamente",
                  "code": "E2C.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-2-1-3",
                  "name": "Julgar recursos de candidatos",
                  "code": "E2C.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-192, OP-197, OP-196).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-e2c-3",
          "name": "Manter Certificações",
          "code": "E2C.3",
          "description": "Manter certificados válidos, atualizados e equivalências concedidas.",
          "responsible": "Educação",
          "l3Processes": [
            {
              "id": "anb-l3-e2c-3-1",
              "name": "Gerir Ciclo de Vida do Certificado",
              "code": "E2C.3.1",
              "description": "Atualiza, concede por equivalência e mantém a base de certificados.",
              "responsible": "Educação",
              "systems": "ANBIMA Edu, Sistema de faturamento/pagamento (voucher e boleto), ANBIMA Edu (formulário de dispensa), SSM",
              "painPoints": "2 de 2 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-193, OP-194; Impactos/penalidades declarados: Inativação/cancelamento indevido da certificação; Risco de contestação por parte de…; Quebra contratual com parceiro de equivalência; Dependência de terceiros: Parceiros de equivalência - CFA Institute, CAIA Association, EFPA - são contrapartes…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-3-1-1",
                  "name": "Atualizar certificações",
                  "code": "E2C.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-193, OP-194).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-3-1-2",
                  "name": "Conceder certificação por equivalência",
                  "code": "E2C.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-193, OP-194).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-3-1-3",
                  "name": "Manter base de profissionais certificados",
                  "code": "E2C.3.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-e2c-4",
          "name": "Promover Educação",
          "code": "E2C.4",
          "description": "Promover educação continuada e financeira.",
          "responsible": "Educação",
          "l3Processes": [
            {
              "id": "anb-l3-e2c-4-1",
              "name": "Gerir Educação Continuada",
              "code": "E2C.4.1",
              "description": "Gerencia conteúdos, jornadas e cursos livres.",
              "responsible": "Educação",
              "systems": "ANBIMA Edu, Anbima Edu BKO, LMS Happmobi",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-198, OP-200; Dependência de terceiros: Sim - Happmobi, fornecedora do LMS que hospeda os cursos livres",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-4-1-1",
                  "name": "Gerir conteúdo e jornadas ANBIMA Edu",
                  "code": "E2C.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-198, OP-200).",
                  "responsible": "Educação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-4-1-2",
                  "name": "Gerir cursos livres",
                  "code": "E2C.4.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-198, OP-200).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-e2c-4-2",
              "name": "Promover Educação Financeira",
              "code": "E2C.4.2",
              "description": "Executa programas de educação financeira para jovens e universitários.",
              "responsible": "Educação",
              "systems": "Como Investir",
              "painPoints": "Dependência de terceiros: Sim - Happmobi (plataforma/LMS)",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-4-2-1",
                  "name": "Executar programa Como Investir em Você",
                  "code": "E2C.4.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-199).",
                  "responsible": "Educação",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-e2c-5",
          "name": "Atender Candidatos e Certificados",
          "code": "E2C.5",
          "description": "Atender candidatos, certificados e instituições.",
          "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
          "l3Processes": [
            {
              "id": "anb-l3-e2c-5-1",
              "name": "Atender e Suportar Usuários de Educação",
              "code": "E2C.5.1",
              "description": "Resolve demandas e ocorrências de candidatos, certificados e instituições.",
              "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
              "systems": "ANBIMA Edu, Anbima Edu BKO, Jira",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-100); Procedimento não documentado ou só informal em OP-183; Impactos/penalidades declarados: Impacto na experiência do público e na reputação da ANBIMA; Não existe; Dependência de terceiros: Parceiros FGV/Cesgranrio; Rox",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-e2c-5-1-1",
                  "name": "Atender demandas do ANBIMA Edu",
                  "code": "E2C.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-183, OP-100).",
                  "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-e2c-5-1-2",
                  "name": "Suportar ocorrências técnicas do ANBIMA Edu",
                  "code": "E2C.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-183, OP-100).",
                  "responsible": "Relacionamento, Tecnologia, Atendimento, Soluções Digitais I",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-i2i",
      "name": "Desenvolvimento de Mercado",
      "namePT": "Desenvolvimento de Mercado",
      "nameEN": "Insight-to-Impact",
      "code": "I2I",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Promover educação, sustentabilidade e inovação no mercado por meio de estudos, redes, jornadas e projetos que antecipem tendências e desenvolvam o ecossistema.",
      "responsible": "Inovação, Sustentabilidade",
      "l2Processes": [
        {
          "id": "anb-l2-i2i-1",
          "name": "Promover Educação, Sustentabilidade e Inovação",
          "code": "I2I.1",
          "description": "Promover educação, sustentabilidade e inovação no mercado (L2 consolidado).",
          "responsible": "Inovação, Sustentabilidade",
          "l3Processes": [
            {
              "id": "anb-l3-i2i-1-1",
              "name": "Gerir Inovação para o Mercado",
              "code": "I2I.1.1",
              "description": "Conduz estudos, testes de hipóteses, redes e projetos estratégicos de inovação.",
              "responsible": "Inovação",
              "systems": "Microsoft Copilot, Microsoft Excel, Microsoft Outlook, Microsoft SharePoint, Microsoft Forms, Microsoft PowerPoint, Microsoft Teams",
              "painPoints": "2 de 3 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-190, OP-191); Dependência de pessoa-chave em OP-190, OP-191; Procedimento não documentado ou só informal em OP-189; Uso de Excel em etapas operacionais (3 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Exposição pública / dano de imagem; Dependência de terceiros: Varia de acordo com o projeto executado; Fornecedores e consultorias contratados para execução dos projetos, indispensáveis…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2i-1-1-1",
                  "name": "Construir projetos do estúdio de inovação",
                  "code": "I2I.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                  "responsible": "Inovação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2i-1-1-2",
                  "name": "Gerir rede ANBIMA de inovação",
                  "code": "I2I.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                  "responsible": "Inovação",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2i-1-1-3",
                  "name": "Coordenar projetos estratégicos de inovação",
                  "code": "I2I.1.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-189, OP-190, OP-191).",
                  "responsible": "Inovação",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-i2i-1-2",
              "name": "Produzir Conhecimento em Finanças Sustentáveis",
              "code": "I2I.1.2",
              "description": "Faz curadoria e disseminação de conteúdo sobre finanças sustentáveis.",
              "responsible": "Sustentabilidade",
              "systems": "WhatsApp",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-184); Impactos/penalidades declarados: Quebra contratual com fornecedor; Dependência de terceiros: Agência de comunicação responsável",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2i-1-2-1",
                  "name": "Curar conteúdo de sustentabilidade e finanças sustentáveis",
                  "code": "I2I.1.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-184).",
                  "responsible": "Sustentabilidade",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-i2i-1-3",
              "name": "Gerir Redes de Sustentabilidade e D&I",
              "code": "I2I.1.3",
              "description": "Opera redes, jornadas, diálogos e eventos com o mercado.",
              "responsible": "Sustentabilidade",
              "systems": "Brevo, Fluig, Microsoft Excel, Microsoft Outlook, Microsoft SharePoint, Microsoft Teams, WhatsApp",
              "painPoints": "3 de 3 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-186, OP-187); Dependência de pessoa-chave em OP-188; Procedimento não documentado ou só informal em OP-188; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Quebra contratual com fornecedor; Quebra contratual com consultores; Dependência de terceiros: Fornecedores responsáveis pela realização do evento (buffet, fotógrafo, recepção,…; Sim, responsável pelo conteúdo do evento",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-i2i-1-3-1",
                  "name": "Realizar eventos presenciais das redes",
                  "code": "I2I.1.3.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                  "responsible": "Sustentabilidade",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2i-1-3-2",
                  "name": "Conduzir Diálogos da rede de D&I",
                  "code": "I2I.1.3.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                  "responsible": "Sustentabilidade",
                  "status": "active"
                },
                {
                  "id": "anb-l4-i2i-1-3-3",
                  "name": "Conduzir Jornadas da rede de sustentabilidade",
                  "code": "I2I.1.3.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-186, OP-187, OP-188).",
                  "responsible": "Sustentabilidade",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-m2c",
      "name": "Associados e profissionais certificados",
      "namePT": "Associados e profissionais certificados",
      "nameEN": "Member-to-Cash",
      "code": "M2C",
      "category": "PRIMARY",
      "businessUnit": "Processos Finalísticos",
      "description": "Engajar associados e mercado, prestar serviços ao associado e converter contribuições, taxas e produtos em receita faturada e recebida.",
      "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI, Relacionamento, Finanças, Atendimento, Gestão de Contratos, Gente Saúde e D&I, Jurídico, Supervisão de Mercados, Business Analytics, Soluções Corporativas, Faturamento, Soluções Digitais I, Contas a Receber",
      "l2Processes": [
        {
          "id": "anb-l2-m2c-1",
          "name": "Engajar Associados e Profissionais certificados",
          "code": "M2C.1",
          "description": "Engajar associados e mercado via marca, comunicação, eventos e proposta de valor.",
          "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
          "l3Processes": [
            {
              "id": "anb-l3-m2c-1-1",
              "name": "Gerir Marca e Comunicação Externa",
              "code": "M2C.1.1",
              "description": "Relaciona-se com imprensa e comunica a associados e ao mercado.",
              "responsible": "Comunicação & Marketing",
              "systems": "Microsoft Outlook, Brevo, Comunique-se, Divulgacoes.anbima, Microsoft Teams, Open Metadata, StreamYard",
              "painPoints": "Procedimento não documentado ou só informal em OP-179, OP-180",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-1-1-1",
                  "name": "Atender a imprensa",
                  "code": "M2C.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-179, OP-180).",
                  "responsible": "Comunicação & Marketing",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-1-1-2",
                  "name": "Comunicar e divulgar informações ao público externo",
                  "code": "M2C.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-179, OP-180).",
                  "responsible": "Comunicação & Marketing",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-m2c-1-2",
              "name": "Realizar Eventos",
              "code": "M2C.1.2",
              "description": "Planeja e executa eventos institucionais.",
              "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
              "systems": "Microsoft Outlook, Microsoft Excel, Microsoft PowerPoint, Microsoft Word, Jira, Microsoft Teams, Sistema de Reserva de Salas",
              "painPoints": "Dependência de pessoa-chave em OP-181; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Multa; Dependência de terceiros: Fornecedores de eventos, transmissão e apoio operacional",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-1-2-1",
                  "name": "Planejar e executar eventos",
                  "code": "M2C.1.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-181, OP-095).",
                  "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-1-2-2",
                  "name": "Suportar tecnicamente eventos institucionais",
                  "code": "M2C.1.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-181, OP-095).",
                  "responsible": "Comunicação & Marketing, Tecnologia, Infraestrutura, Cyper e SI",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-m2c-1-3",
              "name": "Gerir Proposta de Valor ao Associado",
              "code": "M2C.1.3",
              "description": "Segmenta associados, mede satisfação e evolui a oferta.",
              "responsible": "Dono a definir",
              "systems": "CRM do associado (lacuna — ex.: Dynamics/Salesforce) (sugerido), Microsoft Forms ou Brevo para pesquisas (sugerido), Power BI (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-1-3-1",
                  "name": "Segmentar associados e definir proposta de valor",
                  "code": "M2C.1.3.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-1-3-2",
                  "name": "Medir satisfação e engajamento de associados",
                  "code": "M2C.1.3.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-m2c-2",
          "name": "Atender e relacionar",
          "code": "M2C.2",
          "description": "Atender e relacionar-se com associados e mercado.",
          "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
          "l3Processes": [
            {
              "id": "anb-l3-m2c-2-1",
              "name": "Atender Associados e Mercado",
              "code": "M2C.2.1",
              "description": "Resolve dúvidas e responde diligências de clientes.",
              "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
              "systems": "55PBX, Zendesk, Fluig, Jira, Netlex, Portal de Documentos (PDTec / PDSign)",
              "painPoints": "Procedimento não documentado ou só informal em OP-182, OP-012; Impactos/penalidades declarados: Impacto na experiência do público que nos aciona; Dependência de terceiros: Zendesk e 55PBX",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-2-1-1",
                  "name": "Atender e resolver dúvidas",
                  "code": "M2C.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-182, OP-012).",
                  "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-2-1-2",
                  "name": "Responder diligências de clientes e terceiros",
                  "code": "M2C.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-182, OP-012).",
                  "responsible": "Relacionamento, Finanças, Atendimento, Gestão de Contratos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-m2c-3",
          "name": "Prestar Serviços ao Associado",
          "code": "M2C.3",
          "description": "Prestar serviços ao associado, como o ANBIMA Saúde.",
          "responsible": "Gente Saúde e D&I, Jurídico",
          "l3Processes": [
            {
              "id": "anb-l3-m2c-3-1",
              "name": "Operar ANBIMA Saúde",
              "code": "M2C.3.1",
              "description": "Implanta e opera o plano de saúde oferecido às instituições associadas.",
              "responsible": "Gente Saúde e D&I, Jurídico",
              "systems": "ClickUp, Pipefy, Portal de Documentos (PDTec / PDSign), Sisplan, Conversor Bradesco, Microsoft Excel, Microsoft Outlook",
              "painPoints": "1 de 5 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-047, OP-090, OP-048, OP-045, OP-046; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Dependência de terceiros: Bradesco, para disponibilizar o arquivo das vidas em TXT; HealthBit que recebe as informações das empresas, e a Bradesco, para disponibilizar o…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-3-1-1",
                  "name": "Implantar plano de saúde para empresa associada",
                  "code": "M2C.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                  "responsible": "Gente Saúde e D&I, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-3-1-2",
                  "name": "Analisar documentação jurídica de adesão ao plano",
                  "code": "M2C.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                  "responsible": "Gente Saúde e D&I, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-3-1-3",
                  "name": "Cadastrar empresas no SISPLAN",
                  "code": "M2C.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                  "responsible": "Gente Saúde e D&I, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-3-1-4",
                  "name": "Enviar base a prestadores parceiros",
                  "code": "M2C.3.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                  "responsible": "Gente Saúde e D&I, Jurídico",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-3-1-5",
                  "name": "Atualizar portal de movimentações",
                  "code": "M2C.3.1.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-047, OP-090, OP-048, OP-045, OP-046).",
                  "responsible": "Gente Saúde e D&I, Jurídico",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-m2c-4",
          "name": "Apurar e faturar receitas",
          "code": "M2C.4",
          "description": "Apurar e faturar contribuições, taxas, produtos e serviços.",
          "responsible": "Supervisão de Mercados, Tecnologia, Finanças, Gente Saúde e D&I, Business Analytics, Soluções Corporativas",
          "l3Processes": [
            {
              "id": "anb-l3-m2c-4-1",
              "name": "Apurar Receitas",
              "code": "M2C.4.1",
              "description": "Calcula taxas e valores a faturar.",
              "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
              "systems": "Sistemas de Controladoria - Protheus, Databricks, Dataiku, Sistemas de Controladoria - Taxa bimestral (Taxa Bim)",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 1 macroprocesso(s) (OP-104); Dependência de pessoa-chave em OP-104; Procedimento não documentado ou só informal em OP-219; Impactos/penalidades declarados: não existe; Dependência de terceiros: Dataiku e Databricks; GPMA (Fundos) e VHD Prime (Protheus)",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-4-1-1",
                  "name": "Apurar taxas de supervisão",
                  "code": "M2C.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-219, OP-104).",
                  "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-1-2",
                  "name": "Apurar taxa de divulgação de fundos",
                  "code": "M2C.4.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-219, OP-104).",
                  "responsible": "Supervisão de Mercados, Tecnologia, Business Analytics, Soluções Corporativas",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-m2c-4-2",
              "name": "Faturar Produtos e Taxas",
              "code": "M2C.4.2",
              "description": "Emite faturamento de contribuições, taxas, produtos e serviços.",
              "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
              "systems": "Open Metadata, Sistemas de Controladoria - Protheus, SSO, Hub ANBIMA, ANBIMA Edu, SISPLAN, WebTran - Bradesco",
              "painPoints": "1 de 13 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 5 macroprocesso(s) (OP-024, OP-023, OP-026, OP-101, OP-103); Procedimento não documentado ou só informal em OP-017, OP-021, OP-022, OP-025, OP-020, OP-018, OP-019, OP-044; Impactos/penalidades declarados: não existe; Dependência de terceiros: Provedor do sistema (TOTVS); Provedor do sistema HUB, SSO e TOTVS",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-4-2-1",
                  "name": "Faturar contribuição associativa",
                  "code": "M2C.4.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-2",
                  "name": "Faturar taxas de supervisão (anual e semestral)",
                  "code": "M2C.4.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-021; OP-022).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-3",
                  "name": "Faturar taxas de registro de fundos e ofertas públicas",
                  "code": "M2C.4.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-4",
                  "name": "Faturar taxa ANBIMA de fundos de investimento",
                  "code": "M2C.4.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-5",
                  "name": "Faturar multas",
                  "code": "M2C.4.2.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-6",
                  "name": "Faturar ANBIMA Feed",
                  "code": "M2C.4.2.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-7",
                  "name": "Faturar ETF",
                  "code": "M2C.4.2.7",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-8",
                  "name": "Faturar custos SELIC",
                  "code": "M2C.4.2.8",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-9",
                  "name": "Faturar ANBIMA Edu (B2C e B2B)",
                  "code": "M2C.4.2.9",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-026; OP-101).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-10",
                  "name": "Faturar plano de saúde",
                  "code": "M2C.4.2.10",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-4-2-11",
                  "name": "Emitir e transmitir notas fiscais de serviço",
                  "code": "M2C.4.2.11",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-017, OP-021, OP-022, OP-025, OP-024, OP-020, OP-018, OP-019, OP-023, OP-026, OP-101, OP-044, OP-103).",
                  "responsible": "Finanças, Tecnologia, Gente Saúde e D&I, Faturamento, Soluções Digitais I",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-m2c-5",
          "name": "Receber e cobrar",
          "code": "M2C.5",
          "description": "Receber, conciliar e cobrar.",
          "responsible": "Finanças, Contas a Receber",
          "l3Processes": [
            {
              "id": "anb-l3-m2c-5-1",
              "name": "Gerir Recebimentos e Cobrança",
              "code": "M2C.5.1",
              "description": "Concilia recebimentos, trata devoluções e cobra inadimplentes.",
              "responsible": "Finanças, Contas a Receber",
              "systems": "Sistemas de Controladoria - Protheus, Banco do Bradesco, Itaú, Adyen, Fluig, RPA",
              "painPoints": "Sem plano de contingência formal em 4 macroprocesso(s) (OP-031, OP-032, OP-033, OP-034); Dependência de terceiros: Provedor do sistema (TOTVS); Provedor do sistema (TOTVS) Adyen",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-m2c-5-1-1",
                  "name": "Gerir e conciliar recebimentos B2B",
                  "code": "M2C.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                  "responsible": "Finanças, Contas a Receber",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-5-1-2",
                  "name": "Gerir e conciliar recebimentos B2C",
                  "code": "M2C.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                  "responsible": "Finanças, Contas a Receber",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-5-1-3",
                  "name": "Gerir devoluções de pagamentos",
                  "code": "M2C.5.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                  "responsible": "Finanças, Contas a Receber",
                  "status": "active"
                },
                {
                  "id": "anb-l4-m2c-5-1-4",
                  "name": "Gerir cobrança e inadimplência",
                  "code": "M2C.5.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-031, OP-032, OP-033, OP-034).",
                  "responsible": "Finanças, Contas a Receber",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-h2r",
      "name": "Contratar a Desligar",
      "namePT": "Contratar a Desligar",
      "nameEN": "Hire-to-Retire",
      "code": "H2R",
      "category": "SUPPORT",
      "businessUnit": "Processos de Suporte",
      "description": "Planejar, atrair, desenvolver, remunerar e administrar a força de trabalho e fortalecer a cultura da ANBIMA.",
      "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
      "l2Processes": [
        {
          "id": "anb-l2-h2r-1",
          "name": "Planejar Força de Trabalho",
          "code": "H2R.1",
          "description": "Planejar a força de trabalho e seu custo.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-1-1",
              "name": "Planejar Quadro e Custo de Pessoal",
              "code": "H2R.1.1",
              "description": "Planeja quadro, estrutura e orçamento de pessoal.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Plano, Sistema de RH - RM",
              "painPoints": "Procedimento não documentado ou só informal em OP-053",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-1-1-1",
                  "name": "Elaborar orçamento de pessoal",
                  "code": "H2R.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-053).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-1-1-2",
                  "name": "Desenhar e manter estrutura organizacional",
                  "code": "H2R.1.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-h2r-2",
          "name": "Recrutar e Integrar",
          "code": "H2R.2",
          "description": "Recrutar, selecionar e integrar colaboradores.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-2-1",
              "name": "Atrair e Admitir",
              "code": "H2R.2.1",
              "description": "Recruta, seleciona e admite colaboradores.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Gupy, LinkedIn, Microsoft Outlook, WhatsApp, E-SOCIAL, GUPY, Sistema de RH - RM",
              "painPoints": "Procedimento não documentado ou só informal em OP-054, OP-049; Impactos/penalidades declarados: Multa financeira; Dependência de terceiros: Gupy, WallJobs, clínicas de exame ocupacional e suporte TOTVS, conforme o tipo de…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-2-1-1",
                  "name": "Conduzir processo seletivo",
                  "code": "H2R.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-054, OP-049).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-2-1-2",
                  "name": "Admitir colaboradores",
                  "code": "H2R.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-054, OP-049).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-h2r-3",
          "name": "Desenvolver e Crescer",
          "code": "H2R.3",
          "description": "Desenvolver e avaliar colaboradores.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-3-1",
              "name": "Desenvolver Colaboradores",
              "code": "H2R.3.1",
              "description": "Capacita, avalia desempenho e planeja sucessão.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Brevo, Canva, Pipefy, Unico Skill, ImpulseUp",
              "painPoints": "Procedimento não documentado ou só informal em OP-061, OP-064; Dependência de terceiros: Pipefy, Unico skill; ImpulseUp",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-3-1-1",
                  "name": "Gerir treinamento e desenvolvimento",
                  "code": "H2R.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-061, OP-064).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-3-1-2",
                  "name": "Gerir desempenho",
                  "code": "H2R.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-061, OP-064).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-3-1-3",
                  "name": "Desenvolver plano de sucessão",
                  "code": "H2R.3.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-h2r-4",
          "name": "Recompensar e Reter",
          "code": "H2R.4",
          "description": "Remunerar, gerir benefícios e reter.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-4-1",
              "name": "Gerir Remuneração",
              "code": "H2R.4.1",
              "description": "Mantém cargos, salários e incentivos.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Biz",
              "painPoints": "Procedimento não documentado ou só informal em OP-056; Dependência de terceiros: BIZ",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-4-1-1",
                  "name": "Gerir arquitetura de cargos e salários",
                  "code": "H2R.4.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-4-1-2",
                  "name": "Pagar premiações e incentivos",
                  "code": "H2R.4.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-056).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-h2r-4-2",
              "name": "Operar Benefícios",
              "code": "H2R.4.2",
              "description": "Administra benefícios aos colaboradores.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Biz, Alelo, Banco do Bradesco",
              "painPoints": "Procedimento não documentado ou só informal em OP-055, OP-058, OP-057, OP-060; Dependência de terceiros: BIZ; Alelo, Suporte Totvs",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-4-2-1",
                  "name": "Gerir vale-transporte",
                  "code": "H2R.4.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-4-2-2",
                  "name": "Gerir vale-alimentação e refeição",
                  "code": "H2R.4.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-4-2-3",
                  "name": "Gerir seguro de vida",
                  "code": "H2R.4.2.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-4-2-4",
                  "name": "Gerir previdência privada",
                  "code": "H2R.4.2.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-055, OP-058, OP-057, OP-060).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-h2r-5",
          "name": "Administrar Pessoal",
          "code": "H2R.5",
          "description": "Administrar ponto, folha e obrigações trabalhistas.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-5-1",
              "name": "Processar Folha e Jornada",
              "code": "H2R.5.1",
              "description": "Processa ponto, férias, folha e rescisões.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Sistema de RH - RM, E-SOCIAL, Pipefy, Itaú, EMPREGADOR WEB, FGTS DIGITAL",
              "painPoints": "1 de 4 macroprocessos classificados como Crítico/Muito Crítico; Procedimento não documentado ou só informal em OP-059, OP-050, OP-052, OP-051; Impactos/penalidades declarados: Multa financeira; Dependência de terceiros: Suporte TOTVS; Suporte TOTVS, quando houver indisponibilidade ou erro sistêmico",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-5-1-1",
                  "name": "Processar e fechar o ponto",
                  "code": "H2R.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-5-1-2",
                  "name": "Gerir férias",
                  "code": "H2R.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-5-1-3",
                  "name": "Processar e fechar folha de pagamento",
                  "code": "H2R.5.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-5-1-4",
                  "name": "Processar rescisões",
                  "code": "H2R.5.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-059, OP-050, OP-052, OP-051).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-h2r-6",
          "name": "Gerir Cultura e Engajamento",
          "code": "H2R.6",
          "description": "Gerir cultura, comunicação interna e engajamento.",
          "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
          "l3Processes": [
            {
              "id": "anb-l3-h2r-6-1",
              "name": "Fortalecer Cultura e Engajamento",
              "code": "H2R.6.1",
              "description": "Comunica internamente e promove cultura, diversidade e inclusão.",
              "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
              "systems": "Microsoft Outlook, Workvivo",
              "painPoints": "Procedimento não documentado ou só informal em OP-062, OP-063; Dependência de terceiros: Workvivo, Outlook",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-h2r-6-1-1",
                  "name": "Gerir comunicação interna e endomarketing",
                  "code": "H2R.6.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-062, OP-063).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-h2r-6-1-2",
                  "name": "Gerir cultura, diversidade e inclusão",
                  "code": "H2R.6.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-062, OP-063).",
                  "responsible": "Gente Saúde e D&I, Gente Saúde e D&I - Operações e Projetos",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-s2p",
      "name": "Suprir a Pagar",
      "namePT": "Suprir a Pagar",
      "nameEN": "Source-to-Pay",
      "code": "S2P",
      "category": "SUPPORT",
      "businessUnit": "Processos de Suporte",
      "description": "Planejar compras, processar faturas e pagamentos e gerir viagens e despesas com controle e eficiência.",
      "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos, Viagens",
      "l2Processes": [
        {
          "id": "anb-l2-s2p-1",
          "name": "Planejar Compras",
          "code": "S2P.1",
          "description": "Planejar compras e definir estratégia por categoria.",
          "responsible": "A definir",
          "l3Processes": [
            {
              "id": "anb-l3-s2p-1-1",
              "name": "Analisar Gastos e Definir Estratégia de Compras",
              "code": "S2P.1.1",
              "description": "Analisa gastos e define categorias e estratégia de compras.",
              "responsible": "Dono a definir",
              "systems": "Protheus (compras) + Power BI para spend analysis (sugerido)",
              "painPoints": "Capacidade não mapeada no AS-IS; Risco de ausência de dono, de critérios e de evidências para governança/reguladores",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2p-1-1-1",
                  "name": "Analisar perfil de gastos",
                  "code": "S2P.1.1.1",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-1-1-2",
                  "name": "Definir estratégia de compras por categoria",
                  "code": "S2P.1.1.2",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Dono a definir",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-s2p-2",
          "name": "Fatura a Pagamento",
          "code": "S2P.2",
          "description": "Processar faturas e pagamentos (fatura a pagamento).",
          "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
          "l3Processes": [
            {
              "id": "anb-l3-s2p-2-1",
              "name": "Processar Contas a Pagar",
              "code": "S2P.2.1",
              "description": "Valida documentos fiscais e processa pagamentos.",
              "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
              "systems": "Fluig, Microsoft Excel, Sistemas de Controladoria - Protheus, Zendesk, Itaú, Microsoft Outlook, Netlex",
              "painPoints": "1 de 5 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 5 macroprocesso(s) (OP-008, OP-027, OP-015, OP-028, OP-030); Uso de Excel em etapas operacionais (3 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Multa e juros indicados em contrato / boleto; Dependência de terceiros: FLUIG / Protheus",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2p-2-1-1",
                  "name": "Gerir notas fiscais e recebimentos de fornecedores",
                  "code": "S2P.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                  "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-2-1-2",
                  "name": "Classificar documentos fiscais",
                  "code": "S2P.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                  "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-2-1-3",
                  "name": "Validar e solicitar pagamento de contratos",
                  "code": "S2P.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                  "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-2-1-4",
                  "name": "Gerar borderô e incluir pagamentos no banco",
                  "code": "S2P.2.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                  "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-2-1-5",
                  "name": "Processar remessas de câmbio",
                  "code": "S2P.2.1.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-008, OP-027, OP-015, OP-028, OP-030).",
                  "responsible": "Facilities, Finanças, Contas a Pagar, Gestão de Contratos",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-s2p-3",
          "name": "Gerir Viagens e Despesas",
          "code": "S2P.3",
          "description": "Gerir viagens e despesas.",
          "responsible": "Facilities, Viagens",
          "l3Processes": [
            {
              "id": "anb-l3-s2p-3-1",
              "name": "Operar Viagens e Reembolsos",
              "code": "S2P.3.1",
              "description": "Emite serviços de viagem, gerencia prestação de contas e reembolsos.",
              "responsible": "Facilities, Viagens",
              "systems": "Microsoft SharePoint, Trello, Fluig, Sistemas de Controladoria - Protheus, VExpenses, Argo, Ligaí",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-004); Dependência de pessoa-chave em OP-004; Procedimento não documentado ou só informal em OP-002, OP-003, OP-010; Dependência de terceiros: Flytour; Vexpenses",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-s2p-3-1-1",
                  "name": "Emitir serviços de viagem",
                  "code": "S2P.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                  "responsible": "Facilities, Viagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-3-1-2",
                  "name": "Gerir prestação de contas de viagens",
                  "code": "S2P.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                  "responsible": "Facilities, Viagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-3-1-3",
                  "name": "Fechar faturas de agências e cartões",
                  "code": "S2P.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                  "responsible": "Facilities, Viagens",
                  "status": "active"
                },
                {
                  "id": "anb-l4-s2p-3-1-4",
                  "name": "Gerir despesas corporativas e reembolsos",
                  "code": "S2P.3.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-002, OP-003, OP-004, OP-010).",
                  "responsible": "Facilities, Viagens",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-r2r",
      "name": "Planejar a Reportar",
      "namePT": "Planejar a Reportar",
      "nameEN": "Plan/Record-to-Report",
      "code": "R2R",
      "category": "SUPPORT",
      "businessUnit": "Processos de Suporte",
      "description": "Planejar e acompanhar o orçamento, registrar e contabilizar transações, apurar tributos, fechar e reportar e gerir a tesouraria.",
      "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA, Controladoria, Contabilidade, Finanças, Tesouraria, Contas a Pagar",
      "l2Processes": [
        {
          "id": "anb-l2-r2r-1",
          "name": "Planejar, Orçar e Analisar",
          "code": "R2R.1",
          "description": "Planejar, orçar e analisar.",
          "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
          "l3Processes": [
            {
              "id": "anb-l3-r2r-1-1",
              "name": "Elaborar e Acompanhar Orçamento",
              "code": "R2R.1.1",
              "description": "Elabora orçamento anual, acompanha execução e revisões.",
              "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
              "systems": "Plano, Microsoft Outlook, Microsoft Teams, Sistemas de Controladoria - Protheus, Fluig, Microsoft Excel, Microsoft SharePoint",
              "painPoints": "Sem plano de contingência formal em 3 macroprocesso(s) (OP-036, OP-037, OP-127); Dependência de pessoa-chave em OP-127, OP-185; Procedimento não documentado ou só informal em OP-035, OP-096, OP-185; Uso de Excel em etapas operacionais (1 macroprocesso(s)), com risco de erro manual; Impactos/penalidades declarados: Não há penalidade formal",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2r-1-1-1",
                  "name": "Elaborar orçamento anual",
                  "code": "R2R.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                  "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-1-1-2",
                  "name": "Revisar orçamento do convênio ANBIMA/Bacen",
                  "code": "R2R.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                  "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-1-1-3",
                  "name": "Fechar e analisar resultado gerencial mensal",
                  "code": "R2R.1.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-036, OP-037, OP-035, OP-096, OP-127, OP-185).",
                  "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-1-1-4",
                  "name": "Acompanhar orçamento das áreas",
                  "code": "R2R.1.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-096; OP-127; OP-185).",
                  "responsible": "FP&A, Tecnologia, Sustentabilidade, Infraestrutura, Cyper e SI, Produtos de dados e IA",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2r-2",
          "name": "Registrar e Contabilizar",
          "code": "R2R.2",
          "description": "Registrar e contabilizar transações.",
          "responsible": "Controladoria, Contabilidade",
          "l3Processes": [
            {
              "id": "anb-l3-r2r-2-1",
              "name": "Processar Transações Contábeis",
              "code": "R2R.2.1",
              "description": "Contabiliza provisões, pagamentos, faturamento e recebimentos.",
              "responsible": "Controladoria, Contabilidade",
              "systems": "Fluig, Sistemas de Controladoria - Protheus, Jira",
              "painPoints": "2 de 3 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 3 macroprocesso(s) (OP-038, OP-039, OP-040); Impactos/penalidades declarados: Caso não ocorra os pagamentos a associação poderá ser protestada; Caso não ocorra os pagamentos a associação poderá ser protestada ou solicita a…; Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2r-2-1-1",
                  "name": "Manter cadastros contábeis (fornecedores, naturezas, centros de custo)",
                  "code": "R2R.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-2-1-2",
                  "name": "Contabilizar provisões e pagamentos",
                  "code": "R2R.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-2-1-3",
                  "name": "Contabilizar faturamento e recebimentos e tratar inconsistências",
                  "code": "R2R.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-038, OP-039, OP-040).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2r-3",
          "name": "Apurar Tributos e Obrigações",
          "code": "R2R.3",
          "description": "Apurar tributos e entregar obrigações acessórias.",
          "responsible": "Controladoria, Contabilidade",
          "l3Processes": [
            {
              "id": "anb-l3-r2r-3-1",
              "name": "Apurar Tributos e Entregar Obrigações",
              "code": "R2R.3.1",
              "description": "Apura tributos e entrega obrigações acessórias.",
              "responsible": "Controladoria, Contabilidade",
              "systems": "Fluig, Sistemas de Controladoria - Protheus",
              "painPoints": "2 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-041, OP-042); Impactos/penalidades declarados: Caso ocorra cobranças indevidas por parte da ANBIMA estamos sujeitos a sermos…; Estamos sujeitos a pagamentos de multas extremamente elevadas, caso ocorra envio de…; Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2r-3-1-1",
                  "name": "Apurar ISS",
                  "code": "R2R.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-041, OP-042).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-3-1-2",
                  "name": "Entregar obrigações acessórias",
                  "code": "R2R.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-041, OP-042).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2r-4",
          "name": "Fechar e Reportar",
          "code": "R2R.4",
          "description": "Fechar o período e reportar demonstrações.",
          "responsible": "Controladoria, Contabilidade",
          "l3Processes": [
            {
              "id": "anb-l3-r2r-4-1",
              "name": "Fechar e Reportar Demonstrações",
              "code": "R2R.4.1",
              "description": "Fecha o período e reporta demonstrações financeiras auditadas.",
              "responsible": "Controladoria, Contabilidade",
              "systems": "Fluig, Sistemas de Controladoria - Protheus",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-043); Impactos/penalidades declarados: Todos esses trabalhos passam por aprovação do nosso conselho fiscal; Dependência de terceiros: Quando temos problemas com as ferramentas Protheus e Fluig, entramos em contato com o…",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2r-4-1-1",
                  "name": "Executar fechamento contábil e demonstrações auditadas",
                  "code": "R2R.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-043).",
                  "responsible": "Controladoria, Contabilidade",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-r2r-5",
          "name": "Gerir Tesouraria",
          "code": "R2R.5",
          "description": "Gerir tesouraria e liquidez.",
          "responsible": "Finanças, Tesouraria, Contas a Pagar",
          "l3Processes": [
            {
              "id": "anb-l3-r2r-5-1",
              "name": "Gerir Caixa e Liquidez",
              "code": "R2R.5.1",
              "description": "Gerencia posição de caixa, conciliação bancária e aplicações.",
              "responsible": "Finanças, Tesouraria, Contas a Pagar",
              "systems": "Banco BTG, Banco do Bradesco, Banco do Brasil, Itaú, Microsoft Excel, Santander, Total Bank",
              "painPoints": "Sem plano de contingência formal em 2 macroprocesso(s) (OP-016, OP-029); Uso de Excel em etapas operacionais (2 macroprocesso(s)), com risco de erro manual",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-r2r-5-1-1",
                  "name": "Gerir posição de caixa",
                  "code": "R2R.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-016, OP-029).",
                  "responsible": "Finanças, Tesouraria, Contas a Pagar",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-5-1-2",
                  "name": "Executar conciliação bancária",
                  "code": "R2R.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-016, OP-029).",
                  "responsible": "Finanças, Tesouraria, Contas a Pagar",
                  "status": "active"
                },
                {
                  "id": "anb-l4-r2r-5-1-3",
                  "name": "Gerir aplicações financeiras",
                  "code": "R2R.5.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Finanças, Tesouraria, Contas a Pagar",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-tec",
      "name": "Tecnologia e Dados",
      "namePT": "Tecnologia e Dados",
      "nameEN": "IT & Data",
      "code": "TEC",
      "category": "SUPPORT",
      "businessUnit": "Processos de Suporte",
      "description": "Definir estratégia e arquitetura, entregar e sustentar soluções e plataformas de dados, gerir acessos, custos e segurança.",
      "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
      "l2Processes": [
        {
          "id": "anb-l2-tec-1",
          "name": "Estratégia a Portfólio",
          "code": "TEC.1",
          "description": "Definir estratégia, arquitetura, governança de dados e custos de tecnologia.",
          "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
          "l3Processes": [
            {
              "id": "anb-l3-tec-1-1",
              "name": "Gerir Arquitetura e Governança de Dados",
              "code": "TEC.1.1",
              "description": "Define arquitetura, governança, catálogo e qualidade de dados.",
              "responsible": "Tecnologia, Engenharia de Dados",
              "systems": "Databricks, Open Metadata",
              "painPoints": "Sem plano de contingência formal em 3 macroprocesso(s) (OP-105, OP-122, OP-123); Dependência de pessoa-chave em OP-123; Impactos/penalidades declarados: Sanção/advertência do regulador; Dependência de terceiros: Databricks (plataforma) e AWS — indispensáveis para hospedagem e processamento dos dados; Databricks (Unity Catalog) — utilizado como catálogo e ponto de controle de governança",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-1-1-1",
                  "name": "Gerir arquitetura, engenharia e governança de dados",
                  "code": "TEC.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-1-1-2",
                  "name": "Executar governança de dados",
                  "code": "TEC.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-1-1-3",
                  "name": "Operar catálogo de metadados (OpenMetadata)",
                  "code": "TEC.1.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-105, OP-122, OP-123).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                }
              ]
            },
            {
              "id": "anb-l3-tec-1-2",
              "name": "Gerir Custos de Tecnologia (FinOps)",
              "code": "TEC.1.2",
              "description": "Gerencia custos de nuvem e plataformas.",
              "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
              "systems": "Plataforma FinOps, Dataiku",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-116); Dependência de pessoa-chave em OP-116; Dependência de terceiros: AWS, Azure, Google Cloud e parceiros especializado; Databricks e AWS — fornecem os dados de consumo e faturamento",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-1-2-1",
                  "name": "Gerir FinOps de cloud",
                  "code": "TEC.1.2.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-099, OP-116).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-1-2-2",
                  "name": "Gerir FinOps Databricks",
                  "code": "TEC.1.2.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-099, OP-116).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-tec-2",
          "name": "Requisito a Implantação",
          "code": "TEC.2",
          "description": "Desenvolver e implantar soluções.",
          "responsible": "Tecnologia, Engenharia de Dados",
          "l3Processes": [
            {
              "id": "anb-l3-tec-2-1",
              "name": "Desenvolver e Implantar Soluções",
              "code": "TEC.2.1",
              "description": "Constrói pipelines, integrações e esteiras de entrega contínua.",
              "responsible": "Tecnologia, Engenharia de Dados",
              "systems": "Databricks, power bi",
              "painPoints": "Sem plano de contingência formal em 4 macroprocesso(s) (OP-110, OP-112, OP-120, OP-121); Dependência de terceiros: Databricks e AWS — indispensáveis para orquestração e processamento; Databricks e AWS, além dos fornecedores das aplicações integradas",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-2-1-1",
                  "name": "Criar workflows de automação de pipelines",
                  "code": "TEC.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-2-1-2",
                  "name": "Integrar lakehouse com demais aplicações",
                  "code": "TEC.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-2-1-3",
                  "name": "Operar esteira CI/CD de engenharia de dados",
                  "code": "TEC.2.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-2-1-4",
                  "name": "Operar esteira CI/CD de Power BI",
                  "code": "TEC.2.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-110, OP-112, OP-120, OP-121).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-tec-3",
          "name": "Requisição a Atendimento",
          "code": "TEC.3",
          "description": "Atender requisições e gerir acessos.",
          "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
          "l3Processes": [
            {
              "id": "anb-l3-tec-3-1",
              "name": "Provisionar Acessos e Identidades",
              "code": "TEC.3.1",
              "description": "Concede e revoga acessos a sistemas e plataformas.",
              "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
              "systems": "Databricks, Microsoft Teams, Jira, Pipefy, Dataiku",
              "painPoints": "Sem plano de contingência formal em 5 macroprocesso(s) (OP-106, OP-108, OP-107, OP-109, OP-118); Dependência de terceiros: Databricks — plataforma onde os acessos são administrados; Databricks (Unity Catalog) — indispensável para administração das permissões",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-3-1-1",
                  "name": "Conceder acessos a colaboradores e usuários externos",
                  "code": "TEC.3.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-3-1-2",
                  "name": "Conceder e revogar acesso a workspaces",
                  "code": "TEC.3.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-3-1-3",
                  "name": "Conceder e revogar acesso a dados do lakehouse",
                  "code": "TEC.3.1.3",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-3-1-4",
                  "name": "Criar service principals",
                  "code": "TEC.3.1.4",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-3-1-5",
                  "name": "Criar tokens pessoais (PAT)",
                  "code": "TEC.3.1.5",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-3-1-6",
                  "name": "Conceder e revogar acesso ao Dataiku",
                  "code": "TEC.3.1.6",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-098, OP-106, OP-108, OP-107, OP-109, OP-118).",
                  "responsible": "Tecnologia, Infraestrutura, Cyper e SI, Engenharia de Dados",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-tec-4",
          "name": "Detectar a Corrigir",
          "code": "TEC.4",
          "description": "Detectar incidentes e recuperar serviços.",
          "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
          "l3Processes": [
            {
              "id": "anb-l3-tec-4-1",
              "name": "Monitorar e Recuperar Serviços",
              "code": "TEC.4.1",
              "description": "Monitora, trata incidentes e garante recuperação de dados.",
              "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
              "systems": "Databricks, Plataforma de Backup - Shared, Plataforma de Backup - Workload, Plataforma de Backup - Workload Dev, Plataforma de Backup - Workload HML, Plataforma de Backup - Workload PRD",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-113); Dependência de pessoa-chave em OP-097; Dependência de terceiros: Databricks e AWS — indispensáveis para coleta e armazenamento das métricas; Fabricante da solução de backup ou provedor cloud",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-4-1-1",
                  "name": "Observar e tratar incidentes de dados",
                  "code": "TEC.4.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-113, OP-097).",
                  "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-4-1-2",
                  "name": "Executar e recuperar backups",
                  "code": "TEC.4.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-113, OP-097).",
                  "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-4-1-3",
                  "name": "Gerir incidentes de cibersegurança",
                  "code": "TEC.4.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Tecnologia, Engenharia de Dados, Infraestrutura, Cyper e SI",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-tec-5",
          "name": "Sustentar Plataformas",
          "code": "TEC.5",
          "description": "Sustentar plataformas de dados e analytics.",
          "responsible": "Tecnologia, Engenharia de Dados",
          "l3Processes": [
            {
              "id": "anb-l3-tec-5-1",
              "name": "Sustentar Plataformas de Dados e Analytics",
              "code": "TEC.5.1",
              "description": "Mantém disponibilidade das plataformas de dados e analytics.",
              "responsible": "Tecnologia, Engenharia de Dados",
              "systems": "Databricks, Dataiku",
              "painPoints": "1 de 2 macroprocessos classificados como Crítico/Muito Crítico; Sem plano de contingência formal em 2 macroprocesso(s) (OP-117, OP-119); Dependência de terceiros: Databricks e AWS — indispensáveis para operação da plataforma; Dataiku — fornecedor da ferramenta, indispensável para correções e suporte de produto",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-tec-5-1-1",
                  "name": "Sustentar lakehouse",
                  "code": "TEC.5.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-117, OP-119).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                },
                {
                  "id": "anb-l4-tec-5-1-2",
                  "name": "Sustentar Dataiku",
                  "code": "TEC.5.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-117, OP-119).",
                  "responsible": "Tecnologia, Engenharia de Dados",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "anb-l1-fac",
      "name": "Gestão de Instalações",
      "namePT": "Gestão de Instalações",
      "nameEN": "Workplace & Facilities",
      "code": "FAC",
      "category": "SUPPORT",
      "businessUnit": "Processos de Suporte",
      "description": "Manter instalações, serviços gerais e controle de acesso físico.",
      "responsible": "Facilities",
      "l2Processes": [
        {
          "id": "anb-l2-fac-1",
          "name": "Gerir Serviços Prediais",
          "code": "FAC.1",
          "description": "Gerir serviços prediais.",
          "responsible": "Facilities",
          "l3Processes": [
            {
              "id": "anb-l3-fac-1-1",
              "name": "Operar Serviços Gerais",
              "code": "FAC.1.1",
              "description": "Atende chamados operacionais e mantém condições do ambiente.",
              "responsible": "Facilities",
              "systems": "Btime Gestão, Intelligent Touch",
              "painPoints": "Sem plano de contingência formal em 1 macroprocesso(s) (OP-009); Procedimento não documentado ou só informal em OP-005",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-fac-1-1-1",
                  "name": "Gerir chamados e serviços operacionais",
                  "code": "FAC.1.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-005, OP-009).",
                  "responsible": "Facilities",
                  "status": "active"
                },
                {
                  "id": "anb-l4-fac-1-1-2",
                  "name": "Gerir climatização dos ambientes",
                  "code": "FAC.1.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-005, OP-009).",
                  "responsible": "Facilities",
                  "status": "active"
                },
                {
                  "id": "anb-l4-fac-1-1-3",
                  "name": "Planejar manutenção preventiva",
                  "code": "FAC.1.1.3",
                  "description": "Atividade L4 proposta no TO-BE (sem macroprocesso AS-IS correspondente).",
                  "responsible": "Facilities",
                  "status": "active"
                }
              ]
            }
          ]
        },
        {
          "id": "anb-l2-fac-2",
          "name": "Gerir Segurança Física e Acesso",
          "code": "FAC.2",
          "description": "Gerir segurança física e acesso.",
          "responsible": "Facilities",
          "l3Processes": [
            {
              "id": "anb-l3-fac-2-1",
              "name": "Controlar Acesso às Instalações",
              "code": "FAC.2.1",
              "description": "Controla entrada e circulação de colaboradores, visitantes e terceiros.",
              "responsible": "Facilities",
              "systems": "Microsoft Outlook, Microsoft Teams, Safekey, Invenzi",
              "painPoints": "Procedimento não documentado ou só informal em OP-006, OP-007",
              "status": "active",
              "l4Tasks": [
                {
                  "id": "anb-l4-fac-2-1-1",
                  "name": "Gerir acesso e circulação nas instalações",
                  "code": "FAC.2.1.1",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-006, OP-007).",
                  "responsible": "Facilities",
                  "status": "active"
                },
                {
                  "id": "anb-l4-fac-2-1-2",
                  "name": "Gerir acesso aos escritórios",
                  "code": "FAC.2.1.2",
                  "description": "Atividade L4 com macroprocesso AS-IS vinculado (OP-006, OP-007).",
                  "responsible": "Facilities",
                  "status": "active"
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
