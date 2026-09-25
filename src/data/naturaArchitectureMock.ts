import { ArchNodeL1, ArchNodeL2, ArchNodeL3, ArchNodeL4, ProcessContextData } from '../types/architectureContextTypes';

export const l4_1: ProcessContextData = {
  id: 'l4-1', name: "Identificar oportunidades para o negócio", description: "Consolidação de insights de mercado, consumidor, canais e inteligência para identificação de oportunidades de inovação.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Inovação e Consumer Insights", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de gestão de inovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio de produtos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'formulário ou canal de captura de oportunidades.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Oportunidades duplicadas", "falta de critério de priorização", "ausência de evidência de consumidor", "informações dispersas"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Insights de consumidores; tendências; estratégia de categoria; dados de mercado; aprendizados de produtos existentes; oportunidades tecnológicas; demandas de negócio.",
  outputs: "Oportunidade registrada; descrição inicial; necessidade atendida; categoria; público; justificativa; prioridade preliminar; responsável definido.",
  stakeholders: "Inovação; Marketing; Consumer Insights; Gestão de Portfólio; P&D; Tecnologia; liderança de categoria.",
};
export const l4_2: ProcessContextData = {
  id: 'l4-2', name: "Desenvolver conceito e proposta de valor", description: "Estruturação do conceito de produto e sua proposta de valor a partir da oportunidade identificada.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Inovação de Produtos", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de gestão de inovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de conceitos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'bases de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de briefings.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Conceitos genéricos", "baixa diferenciação", "desalinhamento entre áreas", "briefing incompleto"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Oportunidade priorizada; insights; estratégia de categoria; tendências; necessidades de consumidor; posicionamento de marca; restrições iniciais.",
  outputs: "Conceito; proposta de valor; público-alvo; necessidade; benefício; diferenciais; hipóteses de produto; premissas e perguntas para validação.",
  stakeholders: "Marketing; Brand; Consumer Insights; P&D; Design; Gestão de Portfólio; Qualidade; Regulatório.",
};
export const l4_3: ProcessContextData = {
  id: 'l4-3', name: "Validar conceito e proposta de valor", description: "Realização de pesquisas e análises necessárias para avaliar a aderência do conceito e da proposta de valor.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Consumer Insights", area: 'Inteligência de Mercado e Consumidor',
  systemsUsed: [{ systemName: 'Plataforma de pesquisa', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'base de consumidores', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de resultados e evidências.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Pesquisa tardia", "evidência insuficiente", "decisão baseada apenas em opinião"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; hipóteses; público-alvo; objetivos da pesquisa; critérios de decisão; orçamento; prazo.",
  outputs: "Plano de pesquisa; resultado; evidências; aprendizados; avaliação de aderência; recomendação; ajustes requeridos; decisão de encaminhamento.",
  stakeholders: "Inovação; Marketing; Brand; Consumer Insights; Gestão de Portfólio; P&D; Design; liderança decisora.",
};
export const l4_4: ProcessContextData = {
  id: 'l4-4', name: "Avaliar requisitos de Design, Qualidade e Regulatório", description: "Incorporação ao conceito das diretrizes de design e avaliação de requisitos estratégicos de Qualidade, DLL e Regulatório.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "PMO / Governança", area: 'PMO/Governança',
  systemsUsed: [{ systemName: 'Repositórios técnicos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistema de qualidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos regulatórios', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistema de especificações', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio de produtos.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Requisitos descobertos tardiamente", "interpretações diferentes entre áreas", "siglas e critérios não padronizados"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; requisitos de consumidor; estratégia de marca; padrões de qualidade; requisitos regulatórios; características esperadas do produto.",
  outputs: "Diretrizes de design; requisitos de qualidade; critérios de DLL; requisitos regulatórios; restrições técnicas; pendências críticas registradas.",
  stakeholders: "Design; Qualidade; Regulatório; P&D; Inovação; Marketing; Tecnologia; Operações.",
};
export const l4_5: ProcessContextData = {
  id: 'l4-5', name: "Definir arquitetura de portfólio", description: "Avaliar o conceito frente à arquitetura de portfólio, considerando posicionamento e direcionamentos de canais.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Portfólio de produtos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de estratégia', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de categoria e vendas.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Canibalização", "duplicidade de proposta", "ausência de visão consolidada"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; estratégia de categoria; portfólio existente; dados de mercado; objetivos de negócio; arquitetura de marca; proposta de valor.",
  outputs: "Posicionamento na arquitetura de portfólio; papel do produto; lacunas; sobreposições; riscos de canibalização; recomendações e decisão.",
  stakeholders: "Marketing; Brand; Gestão de Portfólio; Inovação; Finanças; Consumer Insights; liderança de categoria.",
};
export const l4_6: ProcessContextData = {
  id: 'l4-6', name: "Consolidar diretrizes de design", description: "Traduzir o conceito em diretrizes de design, estética, experiência e expressão de produto ou embalagem aplicáveis ao desenvolvimento.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Design e Marca", area: 'Inovação',
  systemsUsed: [{ systemName: 'Repositório de design', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'gestão documental', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'biblioteca de marca', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistemas de especificação de embalagem.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Diretrizes subjetivas", "desalinhamento entre design e desenvolvimento", "retrabalho de embalagem"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; arquitetura de portfólio; estratégia de marca; requisitos de consumidor; diretrizes de design de produto.",
  outputs: "Diretrizes de design; referências; critérios de avaliação; requisitos de experiência; orientações visuais e de embalagem.",
  stakeholders: "Design; Brand; Marketing; P&D; Desenvolvimento de Embalagens; Inovação; Qualidade; Regulatório.",
};
export const l4_7: ProcessContextData = {
  id: 'l4-7', name: "Definir diretrizes de qualidade", description: "Definir requisitos e critérios de qualidade que o produto deverá atender ao longo do desenvolvimento e da disponibilização.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Qualidade e Segurança de Produtos", area: 'O&L',
  systemsUsed: [{ systemName: 'Sistema de qualidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'especificações', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório técnico', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'gestão de riscos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos regulatórios.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Requisitos incompletos", "critérios não rastreados até a validação"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; categoria; requisitos regulatórios; padrões internos; riscos; expectativas de consumidor; características de produto; diretrizes de design.",
  outputs: "Critérios de qualidade; requisitos de teste; parâmetros críticos; requisitos de segurança; pendências registradas.",
  stakeholders: "Qualidade; P&D; Regulatório; Inovação; Operações; Supply; Design; Desenvolvimento de Materiais e Formulações.",
};
export const l4_8: ProcessContextData = {
  id: 'l4-8', name: "Analisar impacto ambiental", description: "Avaliar impactos ambientais e oportunidades de melhoria associados ao conceito, materiais, formulação, embalagem e ciclo de vida do produto.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Sustentabilidade e Inovação", area: 'P&D',
  systemsUsed: [{ systemName: 'Ferramentas de avaliação ambiental', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de materiais', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'especificações de embalagem', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de sustentabilidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Dados incompletos de materiais", "avaliação tardia de impacto"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; materiais; formulação; embalagem; volume; cadeia de valor; metas ambientais; políticas de sustentabilidade; requisitos de mercado.",
  outputs: "Avaliação de impacto; oportunidades de redução; restrições; recomendações; requisitos ambientais; decisão sobre adequações necessárias.",
  stakeholders: "Sustentabilidade; P&D; Design; Embalagens; Qualidade; Regulatório; Operações; Supply; Inovação; Marketing.",
};
export const l4_9: ProcessContextData = {
  id: 'l4-9', name: "Construir Business Case inicial", description: "Consolidação dos custos target, despesas/orçamento, estimativa de volume e demais premissas necessárias para estruturar o Business Case inicial.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Gestão de Portfólio e Finanças de Negócio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'finanças', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositórios de projeto', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'modelos de business case', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos técnicos.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Premissas não rastreáveis", "números divergentes", "baixa comparabilidade entre iniciativas"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; arquitetura de portfólio; diretrizes técnicas; impacto ambiental; estimativas de custo; prazo; retorno; riscos; capacidade; premissas de mercado.",
  outputs: "Business case; premissas; cenários; benefícios; custos; riscos; dependências; recomendação; decisão requerida.",
  stakeholders: "Gestão de Portfólio; Marketing; Inovação; Finanças; P&D; Operações; Supply; Sustentabilidade; liderança decisora.",
};
export const l4_10: ProcessContextData = {
  id: 'l4-10', name: "Realizar análise financeira", description: "Avaliação da viabilidade financeira do conceito a partir das premissas e informações consolidadas no Business Case.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Finanças de Negócio e Controladoria", area: 'Finanças',
  systemsUsed: [{ systemName: 'ERP', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'planejamento financeiro', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'modelos financeiros', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de custos, preço, volume e margem.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Dados incompletos", "premissas não alinhadas", "revisões tardias"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Business case; custos de desenvolvimento; custos de materiais e produção; preço; volume; margem; investimentos; cenários; premissas de mercado; cronograma.",
  outputs: "Análise financeira; cenários; premissas; sensibilidade; recomendação; pendências; aprovação ou necessidade de ajuste financeiro.",
  stakeholders: "Finanças; Controladoria; Gestão de Portfólio; Inovação; Marketing; Operações; Supply; liderança decisora.",
};
export const l4_11: ProcessContextData = {
  id: 'l4-11', name: "Criação do projeto no sistema", description: "Criação do projeto no sistema de registro e realizar a carga inicial das informações estratégicas.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "PMO de Inovação e Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema corporativo de projetos e portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de documentos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'cadastro de usuários', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de projeto, categoria, business case e gate.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Cadastro duplicado", "informações incompletas"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; business case; análise financeira; responsáveis; cronograma preliminar; categoria; gate; informações estratégicas; documentos de suporte.",
  outputs: "Projeto criado; dados carregados; responsáveis definidos; documentação vinculada; status inicial registrado; projeto disponível para acompanhamento.",
  stakeholders: "PMO; Gestão de Portfólio; Inovação; líder do projeto; Finanças; Marketing; P&D; Qualidade; Regulatório; Operações.",
};
export const l4_12: ProcessContextData = {
  id: 'l4-12', name: "Aprovar Gate BF", description: "Realização de avaliação integrada dos resultados da Conceituação e decisão pela aprovação ou não aprovação do Gate BF.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Comitê de Governança de Inovação e Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de portfólio e projetos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de documentos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'registros de aprovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'agenda e colaboração', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'histórico de decisões.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Critérios subjetivos", "material incompleto"], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; pesquisa; arquitetura de portfólio; diretrizes de design e qualidade; impacto ambiental; business case; análise financeira; informações estratégicas do projeto; critérios do gate.",
  outputs: "Aprovação; reprovação; retorno para ajustes; aprovação condicionada; decisão registrada; responsáveis e condições definidos; passagem de gate; kick-off técnico acionado.",
  stakeholders: "Comitê de Governança; Gestão de Portfólio; Inovação; Marketing; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Sustentabilidade; Operações; líder do projeto; equipe do kick-off técnico.",
};

export const naturaL1: ArchNodeL1 = {
  id: 'l1-natura',
  name: "Gestão da Inovação de Produtos",
  domain: 'N0',
  category: 'PRIMARY',
  description: "Gerenciar a estratégia, o portfólio e a execução das frentes de inovação de produtos da organização, transformando oportunidades e capacidades em soluções de mercado.",
  objective: "Gerenciar a estratégia, o portfólio e a execução das frentes de inovação de produtos da organização.",
  valueProposition: "Aumentar a competitividade, a velocidade de lançamento e o impacto no negócio através de um modelo integrado de gestão da inovação em produtos.",
  scopeBoundary: "Abrange a gestão de portfólio de produtos e inovação tecnológica, desde a prospecção até a escala e disponibilização.",
  inputs: "Tendências de mercado e comportamento do consumidor; direcionamento estratégico; tecnologias emergentes.",
  outputs: "Portfólio de inovação priorizado; produtos e tecnologias validados e lançados.",
  stakeholders: "Diretoria de Inovação; Marketing; Negócios; P&D; Tecnologia; Operações e Finanças.",
  responsible: "Diretoria de Inovação",
  dimensioning: { allocatedFte: 42, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
  lastUpdate: '24/09/2026',
  criticality: 'Crítica',
  mainKpi: '',
  documentationStatus: 'approved',
  contextValidationPercent: 100,
  policies: [],
  painPoints: [
    "Falta de rastreabilidade entre oportunidade, conceito, decisão de gate e produto final",
    "informações de diferentes áreas mantidas em sistemas desconectados"
  ],
  childrenL2: [
    // ── N1 1: Funil de Produtos ──
    {
      id: 'l2-funil-produtos',
      name: "Funil de Produtos",
      type: "N1",
      description: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.",
      responsible: "Gerência de Inovação de Produtos e Gestão de Portfólio",
      dimensioning: { allocatedFte: 24, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
      objective: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização.",
      valueProposition: "Transformar oportunidades em produtos com conceito claro, proposta de valor relevante, viabilidade demonstrada e prontidão para disponibilização.",
      scopeBoundary: "Inicia na identificação de uma oportunidade de produto e termina na disponibilização do produto.",
      inputs: "Oportunidades de mercado; necessidades de consumidores; estratégia de categoria.",
      outputs: "Conceitos e briefs aprovados; protótipos; resultados de validação; decisões de gate.",
      stakeholders: "Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Operações.",
      painPoints: [
        "Critérios de passagem de etapa pouco explícitos",
        "decisões distribuídas em reuniões, e-mails e documentos"
      ],
      childrenL3: [
        // ── N2 1.1: Conceituação e Briefing ──
        {
          id: 'l3-conceituacao',
          name: "Conceituação e Briefing",
          description: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento.",
          responsible: "Gerência de Conceituação e Briefing de Produtos",
          dimensioning: { allocatedFte: 16, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
          objective: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados.",
          valueProposition: "Criar clareza e alinhamento antes do investimento em prototipagem, reduzindo riscos e ambiguidades.",
          scopeBoundary: "Inicia com a identificação de uma oportunidade para o negócio e termina com a aprovação do business case e a passagem de Gate BF para o kick-off técnico.",
          inputs: "Oportunidade de negócio; insights de consumidor; estratégia de categoria.",
          outputs: "Conceito estruturado; arquitetura de portfólio; diretrizes de design e qualidade; avaliação ambiental; business case; análise financeira; decisão de Gate BF.",
          stakeholders: "Negócio; Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças.",
          painPoints: [
            "Informações distribuídas em fontes diferentes",
            "requisitos críticos identificados tardiamente",
            "falta de critérios objetivos para passagem de gate"
          ],
          childrenL4: [],
          processes: [l4_1, l4_2, l4_3, l4_4, l4_5, l4_6, l4_7, l4_8, l4_9, l4_10, l4_11, l4_12]
        },
        // ── N2 1.2: Prototipagem ──
        {
          id: 'l3-prototipagem',
          name: "Prototipagem",
          description: "Transformar conceitos aprovados em protótipos de produto, formulação, material ou embalagem para avaliação técnica e de experiência.",
          responsible: "Laboratório e Formulação",
          childrenL4: [],
          processes: []
        },
        // ── N2 1.3: Validação ──
        {
          id: 'l3-validacao',
          name: "Validação",
          description: "Confirmar que o protótipo atende aos requisitos de consumidor, desempenho, qualidade, segurança, regulatório e viabilidade definidos.",
          responsible: "Segurança e Eficácia",
          childrenL4: [],
          processes: []
        },
        // ── N2 1.4: Disponibilização ──
        {
          id: 'l3-disponibilizacao',
          name: "Disponibilização",
          description: "Preparar e encaminhar o produto validado para disponibilização, assegurando prontidão operacional, documental, regulatória e comercial.",
          responsible: "Industrialização e Lançamento",
          childrenL4: [],
          processes: []
        }
      ]
    },

    // ── N1 2: Funil de Tecnologia ──
    {
      id: 'l2-funil-tecnologia',
      name: "Funil de Tecnologia",
      type: "N1",
      description: "Desenvolver e disponibilizar capacidades, insumos, formulações, materiais, embalagens, produtos ampliados, metodologias e modelos necessários para viabilizar a inovação de produtos.",
      responsible: "Gerência de Tecnologia e Plataformas",
      dimensioning: { allocatedFte: 18, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
      objective: "Desenvolver e disponibilizar capacidades e tecnologias essenciais para inovação.",
      valueProposition: "Criar diferenciais tecnológicos e viabilizar novas soluções para o portfólio de produtos.",
      scopeBoundary: "Da pesquisa aplicada e ideação tecnológica à qualificação e entrega para os projetos de produto.",
      inputs: "Tendências tecnológicas; roadmap de inovação; requisitos de produto.",
      outputs: "Tecnologias qualificadas; metodologias e formulações validadas.",
      stakeholders: "P&D; Engenharia; Inovação Aberta; Fornecedores.",
      painPoints: ["Descompasso entre tempo de pesquisa e ciclo de lançamento de produto."],
      childrenL3: [
        // ── N2 2.1: Prospecção e Ideação ──
        { id: 'l3-prospeccao', name: "Prospecção e Ideação", description: "Identificar tendências, necessidades e oportunidades tecnológicas que possam viabilizar novos produtos ou melhorar produtos existentes.", childrenL4: [], processes: [] },
        // ── N2 2.2: Desenvolvimento de Insumos ──
        { id: 'l3-desenv-insumos', name: "Desenvolvimento de Insumos", description: "Desenvolver e qualificar insumos necessários para atender aos requisitos de novos produtos.", childrenL4: [], processes: [] },
        // ── N2 2.3: Tecnologia de Ingredientes e Formulações ──
        { id: 'l3-tec-ingredientes', name: "Tecnologia de Ingredientes e Formulações", description: "Desenvolver ingredientes, formulações e soluções técnicas compatíveis com o conceito e os requisitos do produto.", childrenL4: [], processes: [] },
        // ── N2 2.4: Desenvolvimento de Materiais e Embalagens ──
        { id: 'l3-desenv-materiais', name: "Desenvolvimento de Materiais e Embalagens", description: "Desenvolver materiais e embalagens que atendam a design, funcionalidade, proteção, custo, qualidade e sustentabilidade.", childrenL4: [], processes: [] },
        // ── N2 2.5: Produto Ampliado ──
        { id: 'l3-produto-ampliado', name: "Produto Ampliado", description: "Desenvolver extensões, complementos, experiências ou soluções ampliadas que aumentem o valor entregue pelo produto.", childrenL4: [], processes: [] },
        // ── N2 2.6: Metodologias e Modelos ──
        { id: 'l3-metodologias', name: "Metodologias e Modelos", description: "Desenvolver, organizar e disponibilizar metodologias, modelos, padrões e ferramentas para apoiar a inovação e o desenvolvimento de produtos.", childrenL4: [], processes: [] }
      ]
    }
  ]
};

