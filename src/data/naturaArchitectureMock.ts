import { ArchNodeL1, ArchNodeL2, ArchNodeL3, ArchNodeL4, ProcessContextData } from '../types/architectureContextTypes';

export const l4_1: ProcessContextData = {
  id: 'l4-1', name: "Identificar oportunidades para o negócio", description: "Identificar, registrar e priorizar oportunidades de produto relevantes para a estratégia, as necessidades dos consumidores e as tendências de mercado.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Inovação e Consumer Insights", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de gestão de inovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio de produtos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'formulário ou canal de captura de oportunidades.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Oportunidades duplicadas", "falta de crit\u00e9rio de prioriza\u00e7\u00e3o", "aus\u00eancia de evid\u00eancia de consumidor", "informa\u00e7\u00f5es dispersas", "oportunidade de classifica\u00e7\u00e3o e sumariza\u00e7\u00e3o assistidas por IA."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Insights de consumidores; tendências; estratégia de categoria; dados de mercado; aprendizados de produtos existentes; oportunidades tecnológicas; demandas de negócio.",
  outputs: "Oportunidade registrada; descrição inicial; necessidade atendida; categoria; público; justificativa; prioridade preliminar; responsável definido.",
  stakeholders: "Inovação; Marketing; Consumer Insights; Gestão de Portfólio; P&D; Tecnologia; liderança de categoria.",
};
export const l4_2: ProcessContextData = {
  id: 'l4-2', name: "Desenvolver conceito e proposta de valor", description: "Transformar uma oportunidade em um conceito de produto com público, necessidade, benefício, diferenciais e hipótese de valor definidos.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Inovação de Produtos", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de gestão de inovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de conceitos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'bases de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de briefings.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Conceitos gen\u00e9ricos", "baixa diferencia\u00e7\u00e3o", "desalinhamento entre \u00e1reas", "briefing incompleto", "oportunidade de gerar primeira vers\u00e3o do conceito a partir de evid\u00eancias estruturadas."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Oportunidade priorizada; insights; estratégia de categoria; tendências; necessidades de consumidor; posicionamento de marca; restrições iniciais.",
  outputs: "Conceito; proposta de valor; público-alvo; necessidade; benefício; diferenciais; hipóteses de produto; premissas e perguntas para validação.",
  stakeholders: "Marketing; Brand; Consumer Insights; P&D; Design; Gestão de Portfólio; Qualidade; Regulatório.",
};
export const l4_3: ProcessContextData = {
  id: 'l4-3', name: "Pesquisar e validar conceito e proposta de valor", description: "Avaliar se o conceito e a proposta de valor apresentam relevância, entendimento, diferenciação e potencial de aceitação pelo consumidor e pelo mercado.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Consumer Insights", area: 'Inovação',
  systemsUsed: [{ systemName: 'Plataforma de pesquisa', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de insights', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'base de consumidores', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de resultados e evidências.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Pesquisa tardia", "evid\u00eancia insuficiente", "decis\u00e3o baseada apenas em opini\u00e3o", "amostras inadequadas", "oportunidade de consolidar evid\u00eancias e comparar conceitos."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; hipóteses; público-alvo; objetivos da pesquisa; critérios de decisão; orçamento; prazo.",
  outputs: "Plano de pesquisa; resultado; evidências; aprendizados; avaliação de aderência; recomendação; ajustes requeridos; decisão de encaminhamento.",
  stakeholders: "Inovação; Marketing; Brand; Consumer Insights; Gestão de Portfólio; P&D; Design; liderança decisora.",
};
export const l4_4: ProcessContextData = {
  id: 'l4-4', name: "Definir design de produto — Qualidade, DLL e Regulatório", description: "Estabelecer as diretrizes iniciais de design, qualidade, DLL e requisitos regulatórios que condicionam o desenvolvimento do produto.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Desenvolvimento de Produtos", area: 'Inovação',
  systemsUsed: [{ systemName: 'Repositórios técnicos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistema de qualidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos regulatórios', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistema de especificações', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio de produtos.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Requisitos descobertos tardiamente", "interpreta\u00e7\u00f5es diferentes entre \u00e1reas", "siglas e crit\u00e9rios n\u00e3o padronizados", "oportunidade de checklist de requisitos e rastreabilidade."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; requisitos de consumidor; estratégia de marca; padrões de qualidade; requisitos regulatórios; características esperadas do produto.",
  outputs: "Diretrizes de design; requisitos de qualidade; critérios de DLL; requisitos regulatórios; restrições técnicas; pendências críticas registradas.",
  stakeholders: "Design; Qualidade; Regulatório; P&D; Inovação; Marketing; Tecnologia; Operações.",
};
export const l4_5: ProcessContextData = {
  id: 'l4-5', name: "Desenhar arquitetura de portfólio", description: "Posicionar o conceito na arquitetura de portfólio, considerando categoria, linha, papel estratégico, complementaridades e possíveis conflitos.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Portfólio de produtos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de estratégia', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de categoria e vendas.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Canibaliza\u00e7\u00e3o", "duplicidade de proposta", "aus\u00eancia de vis\u00e3o consolidada", "dados de portf\u00f3lio desatualizados", "oportunidade de an\u00e1lise de lacunas e similaridade."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; estratégia de categoria; portfólio existente; dados de mercado; objetivos de negócio; arquitetura de marca; proposta de valor.",
  outputs: "Posicionamento na arquitetura de portfólio; papel do produto; lacunas; sobreposições; riscos de canibalização; recomendações e decisão.",
  stakeholders: "Marketing; Brand; Gestão de Portfólio; Inovação; Finanças; Consumer Insights; liderança de categoria.",
};
export const l4_6: ProcessContextData = {
  id: 'l4-6', name: "Definir diretrizes de design", description: "Traduzir o conceito em diretrizes de design, estética, experiência e expressão de produto ou embalagem aplicáveis ao desenvolvimento.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Design e Marca", area: 'Inovação',
  systemsUsed: [{ systemName: 'Repositório de design', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'gestão documental', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'biblioteca de marca', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'sistemas de especificação de embalagem.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Diretrizes subjetivas", "desalinhamento entre design e desenvolvimento", "retrabalho de embalagem", "oportunidade de biblioteca de padr\u00f5es e crit\u00e9rios de aprova\u00e7\u00e3o."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; arquitetura de portfólio; estratégia de marca; requisitos de consumidor; diretrizes de design de produto.",
  outputs: "Diretrizes de design; referências; critérios de avaliação; requisitos de experiência; orientações visuais e de embalagem.",
  stakeholders: "Design; Brand; Marketing; P&D; Desenvolvimento de Embalagens; Inovação; Qualidade; Regulatório.",
};
export const l4_7: ProcessContextData = {
  id: 'l4-7', name: "Definir diretrizes de qualidade", description: "Definir requisitos e critérios de qualidade que o produto deverá atender ao longo do desenvolvimento e da disponibilização.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Qualidade e Segurança de Produtos", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de qualidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'especificações', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório técnico', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'gestão de riscos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos regulatórios.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Requisitos incompletos", "crit\u00e9rios n\u00e3o rastreados at\u00e9 a valida\u00e7\u00e3o", "diverg\u00eancia entre \u00e1reas", "oportunidade de matriz de requisitos e evid\u00eancias."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; categoria; requisitos regulatórios; padrões internos; riscos; expectativas de consumidor; características de produto; diretrizes de design.",
  outputs: "Critérios de qualidade; requisitos de teste; parâmetros críticos; requisitos de segurança; pendências registradas.",
  stakeholders: "Qualidade; P&D; Regulatório; Inovação; Operações; Supply; Design; Desenvolvimento de Materiais e Formulações.",
};
export const l4_8: ProcessContextData = {
  id: 'l4-8', name: "Avaliar impacto ambiental", description: "Avaliar impactos ambientais e oportunidades de melhoria associados ao conceito, materiais, formulação, embalagem e ciclo de vida do produto.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Sustentabilidade e Inovação", area: 'Inovação',
  systemsUsed: [{ systemName: 'Ferramentas de avaliação ambiental', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de materiais', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'especificações de embalagem', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de sustentabilidade', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Dados incompletos de materiais", "avalia\u00e7\u00e3o tardia de impacto", "dificuldade de comparar alternativas", "oportunidade de indicadores ambientais incorporados ao business case."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; materiais; formulação; embalagem; volume; cadeia de valor; metas ambientais; políticas de sustentabilidade; requisitos de mercado.",
  outputs: "Avaliação de impacto; oportunidades de redução; restrições; recomendações; requisitos ambientais; decisão sobre adequações necessárias.",
  stakeholders: "Sustentabilidade; P&D; Design; Embalagens; Qualidade; Regulatório; Operações; Supply; Inovação; Marketing.",
};
export const l4_9: ProcessContextData = {
  id: 'l4-9', name: "Construir o business case (BC)", description: "Consolidar a justificativa estratégica, operacional e financeira para decidir sobre a continuidade da iniciativa.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Gestão de Portfólio e Finanças de Negócio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'finanças', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositórios de projeto', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de mercado', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'modelos de business case', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'documentos técnicos.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Premissas n\u00e3o rastre\u00e1veis", "n\u00fameros divergentes", "baixa comparabilidade entre iniciativas", "revis\u00f5es manuais", "oportunidade de modelo padronizado e preenchimento assistido."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; arquitetura de portfólio; diretrizes técnicas; impacto ambiental; estimativas de custo; prazo; retorno; riscos; capacidade; premissas de mercado.",
  outputs: "Business case; premissas; cenários; benefícios; custos; riscos; dependências; recomendação; decisão requerida.",
  stakeholders: "Gestão de Portfólio; Marketing; Inovação; Finanças; P&D; Operações; Supply; Sustentabilidade; liderança decisora.",
};
export const l4_10: ProcessContextData = {
  id: 'l4-10', name: "Realizar análise financeira", description: "Avaliar a viabilidade financeira da iniciativa, considerando investimentos, custos, receitas, margem, cenários e riscos.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Gerência de Finanças de Negócio e Controladoria", area: 'Inovação',
  systemsUsed: [{ systemName: 'ERP', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'planejamento financeiro', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'modelos financeiros', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de custos, preço, volume e margem.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Dados incompletos", "premissas n\u00e3o alinhadas", "revis\u00f5es tardias", "baixa integra\u00e7\u00e3o entre modelos e sistema", "oportunidade de padronizar premissas e cen\u00e1rios."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Business case; custos de desenvolvimento; custos de materiais e produção; preço; volume; margem; investimentos; cenários; premissas de mercado; cronograma.",
  outputs: "Análise financeira; cenários; premissas; sensibilidade; recomendação; pendências; aprovação ou necessidade de ajuste financeiro.",
  stakeholders: "Finanças; Controladoria; Gestão de Portfólio; Inovação; Marketing; Operações; Supply; liderança decisora.",
};
export const l4_11: ProcessContextData = {
  id: 'l4-11', name: "Criar projeto no sistema e carregar informações estratégicas", description: "Criar o registro oficial do projeto e garantir que suas informações estratégicas estejam disponíveis para governança e acompanhamento.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "PMO de Inovação e Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema corporativo de projetos e portfólio', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de documentos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'cadastro de usuários', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'dados de projeto, categoria, business case e gate.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Cadastro duplicado", "informa\u00e7\u00f5es incompletas", "diverg\u00eancia entre documentos e sistema", "falta de padr\u00e3o de preenchimento", "oportunidade de valida\u00e7\u00e3o autom\u00e1tica de campos obrigat\u00f3rios."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; business case; análise financeira; responsáveis; cronograma preliminar; categoria; gate; informações estratégicas; documentos de suporte.",
  outputs: "Projeto criado; dados carregados; responsáveis definidos; documentação vinculada; status inicial registrado; projeto disponível para acompanhamento.",
  stakeholders: "PMO; Gestão de Portfólio; Inovação; líder do projeto; Finanças; Marketing; P&D; Qualidade; Regulatório; Operações.",
};
export const l4_12: ProcessContextData = {
  id: 'l4-12', name: "Realizar Gate BF — aprovação e passagem para kick-off técnico", description: "Avaliar a completude, atratividade, viabilidade e riscos da iniciativa e decidir sua aprovação, retorno, condicionamento ou interrupção.",
  documentationStatus: 'approved', contextValidationStatus: 'validated', responsible: "Comitê de Governança de Inovação e Gestão de Portfólio", area: 'Inovação',
  systemsUsed: [{ systemName: 'Sistema de portfólio e projetos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'repositório de documentos', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'registros de aprovação', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'agenda e colaboração', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }, { systemName: 'histórico de decisões.', operation: 'escrita', dataObjects: [], dependencies: [], isManual: false }],
  dataObjects: [], businessRules: [], regulations: [], painPoints: ["Crit\u00e9rios subjetivos", "material incompleto", "decis\u00f5es sem rastreabilidade", "participantes sem informa\u00e7\u00e3o pr\u00e9via", "atraso entre aprova\u00e7\u00e3o e kick-off", "oportunidade de checklist digital, pontua\u00e7\u00e3o de prontid\u00e3o e ata assistida por IA."], evidences: [], openQuestions: [],
  businessIndicators: [], contextIndicators: [], relations: [],
  inputs: "Conceito; proposta de valor; pesquisa; arquitetura de portfólio; diretrizes de design e qualidade; impacto ambiental; business case; análise financeira; informações estratégicas do projeto; critérios do gate.",
  outputs: "Aprovação; reprovação; retorno para ajustes; aprovação condicionada; decisão registrada; responsáveis e condições definidos; passagem de gate; kick-off técnico acionado.",
  stakeholders: "Comitê de Governança; Gestão de Portfólio; Inovação; Marketing; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Sustentabilidade; Operações; líder do projeto; equipe do kick-off técnico.",
};

export const naturaL1: ArchNodeL1 = {
  id: 'l1-natura', name: "Gestão da Inovação de Produtos", domain: 'Primário', category: 'PRIMARY',
  description: "Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado.", objective: "Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado.",
  valueProposition: "Aumentar a qualidade e a previsibilidade das decisões de inovação, conectando estratégia, consumidores, formulação, materiais, tecnologia, viabilidade financeira, qualidade, requisitos regulatórios e disponibilização do produto.", scopeBoundary: "Abrange a gestão dos funis de produtos e de tecnologia, desde a identificação de oportunidades e ideação até as decisões de conceituação, prototipagem, validação e disponibilização. O domínio coordena a passagem entre as etapas e a decisão de continuidade das iniciativas.",
  inputs: "Tendências e necessidades de consumidores; estratégia e prioridades de portfólio; oportunidades de mercado; aprendizados de produtos existentes; capacidades de ingredientes, formulações, materiais e embalagens; requisitos de qualidade e regulatórios; restrições de custo, prazo e capacidade; metas de sustentabilidade.", outputs: "Conceitos priorizados; briefs aprovados; business cases; projetos autorizados; protótipos e soluções validadas; decisões de gate; produtos disponibilizados; aprendizados e informações estratégicas registrados no sistema.",
  stakeholders: "Consumidores; Marketing e Brand; Consumer Insights; Pesquisa e Desenvolvimento; Qualidade; Assuntos Regulatórios; Suprimentos; Operações industriais; Engenharia; Finanças; Tecnologia; Sustentabilidade; Comercial; fornecedores e parceiros de inovação.", responsible: "Diretoria de Inovação e Desenvolvimento de Produtos",
  dimensioning: { allocatedFte: 42, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
  lastUpdate: '22/09/2026', criticality: 'Crítica', mainKpi: '',
  documentationStatus: 'approved', contextValidationPercent: 100, policies: [], painPoints: ["Falta de rastreabilidade entre oportunidade, conceito, decis\u00e3o de gate e produto final", "informa\u00e7\u00f5es de diferentes \u00e1reas mantidas em sistemas ou documentos desconectados", "retrabalho por mudan\u00e7as tardias em conceito, formula\u00e7\u00e3o, embalagem ou requisitos regulat\u00f3rios", "crit\u00e9rios de decis\u00e3o diferentes entre projetos ou categorias", "baixa visibilidade do esfor\u00e7o e da capacidade alocada por iniciativa", "necessidade de integrar dados de produto, tecnologia, qualidade, finan\u00e7as e sustentabilidade", "oportunidade de usar IA para consolidar informa\u00e7\u00f5es, identificar lacunas de briefing e apoiar prioriza\u00e7\u00e3o."],
  childrenL2: [
    {
      id: 'l2-funil-produtos', name: "Funil de Produtos", type: "Agrupamento de valor", description: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.",
      responsible: "Gerência de Inovação de Produtos e Gestão de Portfólio", dimensioning: { allocatedFte: 24, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
      objective: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.", valueProposition: "Transformar oportunidades em produtos com conceito claro, proposta de valor relevante, viabilidade demonstrada e prontidão para disponibilização.",
      scopeBoundary: "Inicia na identificação ou priorização de uma oportunidade de produto e termina na disponibilização do produto para a etapa operacional ou comercial definida. Inclui o direcionamento do conceito, o desenvolvimento, as validações e as decisões de gate do funil.",
      inputs: "Oportunidades de mercado; necessidades de consumidores; estratégia de categoria; insights; briefings; capacidades técnicas; restrições de custo, prazo e sustentabilidade; decisões de portfólio; informações fornecidas pelo Funil de Tecnologia.", outputs: "Conceitos e briefs aprovados; protótipos; resultados de validação; business cases; decisões de gate; produto liberado para disponibilização.",
      stakeholders: "Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Operações; Supply; Sustentabilidade; liderança de portfólio; fornecedores e parceiros.",
      painPoints: ["Crit\u00e9rios de passagem de etapa pouco expl\u00edcitos", "decis\u00f5es distribu\u00eddas em reuni\u00f5es, e-mails e documentos", "lacunas de informa\u00e7\u00e3o identificadas somente em etapas avan\u00e7adas", "depend\u00eancias entre produto e tecnologia n\u00e3o vis\u00edveis no funil", "falta de vis\u00e3o consolidada de capacidade, prazo, custo e risco", "oportunidade de automatizar a verifica\u00e7\u00e3o de completude antes dos gates."],
      childrenL3: [
        {
          id: 'l3-conceituacao', name: "Conceituação e Briefing", type: "Etapa de valor", description: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento.",
          responsible: "Gerência de Conceituação e Briefing de Produtos", dimensioning: { allocatedFte: 16, unit: 'FTE', referenceDate: '2026-09-22', validationStatus: 'validado' },
          objective: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento.", valueProposition: "Criar clareza e alinhamento antes do investimento em prototipagem, reduzindo ambiguidades, retrabalho e riscos de desenvolver soluções sem aderência ao consumidor, ao negócio ou às restrições técnicas e regulatórias.",
          scopeBoundary: "Inicia com a identificação de uma oportunidade para o negócio e termina com a aprovação do business case e a passagem de Gate BF para o kick-off técnico. Inclui conceito, pesquisa, arquitetura de portfólio, diretrizes de design e qualidade, impacto ambiental, business case, análise financeira e registro do projeto.", 
          inputs: "Oportunidade de negócio; insights de consumidor; estratégia de categoria; tendências; proposta de valor inicial; diretrizes de design; diretrizes de qualidade; requisitos regulatórios; dados técnicos; premissas financeiras; metas ambientais; capacidades do Funil de Tecnologia.", outputs: "Conceito e proposta de valor estruturados; arquitetura de portfólio; diretrizes de design e qualidade; avaliação de impacto ambiental; business case; análise financeira; projeto criado no sistema; informações estratégicas carregadas; decisão de Gate BF; passagem para kick-off técnico.", stakeholders: "Negócio; Marketing; Consumer Insights; P&D; Tecnologia; Qualidade; Regulatório; Finanças; Sustentabilidade; Operações; Supply; Gestão de Portfólio; liderança decisora e equipe do kick-off técnico.",
          painPoints: ["Informa\u00e7\u00f5es de conceito, qualidade, regulat\u00f3rio, sustentabilidade e finan\u00e7as distribu\u00eddas em fontes diferentes", "requisitos cr\u00edticos identificados tardiamente", "retrabalho entre \u00e1reas", "falta de crit\u00e9rios objetivos para passagem de gate", "demora para consolidar o business case", "falta de rastreabilidade entre decis\u00e3o e projeto", "oportunidade de usar IA para verificar completude, resumir evid\u00eancias e apontar conflitos ou lacunas."],
          childrenL4: [
            { id: 'l4-1', name: 'Identificar oportunidades para o negócio', processes: [l4_1] }, { id: 'l4-2', name: 'Desenvolver conceito e proposta de valor', processes: [l4_2] }, { id: 'l4-3', name: 'Pesquisar e validar conceito e proposta de valor', processes: [l4_3] }, { id: 'l4-4', name: 'Definir design de produto — Qualidade, DLL e Regulatório', processes: [l4_4] }, { id: 'l4-5', name: 'Desenhar arquitetura de portfólio', processes: [l4_5] }, { id: 'l4-6', name: 'Definir diretrizes de design', processes: [l4_6] }, { id: 'l4-7', name: 'Definir diretrizes de qualidade', processes: [l4_7] }, { id: 'l4-8', name: 'Avaliar impacto ambiental', processes: [l4_8] }, { id: 'l4-9', name: 'Construir o business case (BC)', processes: [l4_9] }, { id: 'l4-10', name: 'Realizar análise financeira', processes: [l4_10] }, { id: 'l4-11', name: 'Criar projeto no sistema e carregar informações estratégicas', processes: [l4_11] }, { id: 'l4-12', name: 'Realizar Gate BF — aprovação e passagem para kick-off técnico', processes: [l4_12] }
          ]
        }
      ]
    }
  ]
};
