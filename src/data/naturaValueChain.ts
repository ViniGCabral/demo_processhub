import type { L1Process } from "@/stores/valueChainStore";

export function buildNaturaValueChain(): L1Process[] {
  return [
    {
      id: "l1-natura",
      name: "Gestão da Inovação de Produtos",
      namePT: "Gestão da Inovação de Produtos",
      nameEN: "Product Innovation Management",
      code: "GINP",
      category: "PRIMARY",
      businessUnit: "Diretoria de Inovação de Produtos",
      description: "Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado.",
      l2Processes: [
        // ── N1 1: Funil de Produtos ──
        {
          id: "l2-funil-produtos",
          name: "Funil de Produtos",
          code: "FP",
          description: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.",
          businessUnit: "Gerência de Inovação de Produtos e Gestão de Portfólio",
          l3Processes: [
            // ── N2 1.1: Conceituação e Briefing ──
            {
              id: "l3-conceituacao",
              name: "Conceituação e Briefing",
              code: "CB",
              description: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento.",
              businessUnit: "Conceituação e Briefing",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-1",
                  name: "Identificar oportunidades para o negócio",
                  code: "L4.1",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Consolidação de insights de mercado, consumidor, canais e inteligência para identificação de oportunidades de inovação."
                },
                {
                  id: "l4-2",
                  name: "Desenvolver conceito e proposta de valor",
                  code: "L4.2",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Estruturação do conceito de produto e sua proposta de valor a partir da oportunidade identificada."
                },
                {
                  id: "l4-3",
                  name: "Validar conceito e proposta de valor",
                  code: "L4.3",
                  status: "active",
                  responsible: "Inteligência de Mercado e Consumidor",
                  businessUnit: "Inteligência de Mercado e Consumidor",
                  description: "Realização de pesquisas e análises necessárias para avaliar a aderência do conceito e da proposta de valor."
                },
                {
                  id: "l4-4",
                  name: "Avaliar requisitos de Design, Qualidade e Regulatório",
                  code: "L4.4",
                  status: "active",
                  responsible: "PMO/Governança",
                  businessUnit: "PMO/Governança",
                  description: "Incorporação ao conceito das diretrizes de design e avaliação de requisitos estratégicos de Qualidade, DLL e Regulatório."
                },
                {
                  id: "l4-5",
                  name: "Definir arquitetura de portfólio",
                  code: "L4.5",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Avaliar o conceito frente à arquitetura de portfólio, considerando posicionamento e direcionamentos de canais."
                },
                {
                  id: "l4-6",
                  name: "Consolidar diretrizes de design",
                  code: "L4.6",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Traduzir o conceito em diretrizes de design, estética, experiência e expressão de produto ou embalagem aplicáveis ao desenvolvimento."
                },
                {
                  id: "l4-7",
                  name: "Definir diretrizes de qualidade",
                  code: "L4.7",
                  status: "active",
                  responsible: "O&L",
                  businessUnit: "O&L",
                  description: "Definir requisitos e critérios de qualidade que o produto deverá atender ao longo do desenvolvimento e da disponibilização."
                },
                {
                  id: "l4-8",
                  name: "Analisar impacto ambiental",
                  code: "L4.8",
                  status: "active",
                  responsible: "P&D",
                  businessUnit: "P&D",
                  description: "Avaliar impactos ambientais e oportunidades de melhoria associados ao conceito, materiais, formulação, embalagem e ciclo de vida do produto."
                },
                {
                  id: "l4-9",
                  name: "Construir Business Case inicial",
                  code: "L4.9",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Consolidação dos custos target, despesas/orçamento, estimativa de volume e demais premissas necessárias para estruturar o Business Case inicial."
                },
                {
                  id: "l4-10",
                  name: "Realizar análise financeira",
                  code: "L4.10",
                  status: "active",
                  responsible: "Finanças",
                  businessUnit: "Finanças",
                  description: "Avaliação da viabilidade financeira do conceito a partir das premissas e informações consolidadas no Business Case."
                },
                {
                  id: "l4-11",
                  name: "Criação do projeto no sistema",
                  code: "L4.11",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Criação do projeto no sistema de registro e realização da carga inicial das informações estratégicas."
                },
                {
                  id: "l4-12",
                  name: "Aprovar Gate BF",
                  code: "L4.12",
                  status: "active",
                  responsible: "Inovação",
                  businessUnit: "Inovação",
                  description: "Realização da avaliação integrada dos resultados da Conceituação e decisão pela aprovação ou não aprovação do Gate BF."
                }
              ]
            },
            // ── N2 1.2: Prototipagem ──
            {
              id: "l3-prototipagem",
              name: "Prototipagem",
              code: "PROT",
              status: "active",
              businessUnit: "Laboratório e Formulação",
              description: "Transformar conceitos aprovados em protótipos de produto, formulação, material ou embalagem para avaliação técnica e de experiência.",
              l4Tasks: []
            },
            // ── N2 1.3: Validação ──
            {
              id: "l3-validacao",
              name: "Validação",
              code: "VAL",
              status: "active",
              businessUnit: "Segurança e Eficácia",
              description: "Confirmar que o protótipo atende aos requisitos de consumidor, desempenho, qualidade, segurança, regulatório e viabilidade definidos.",
              l4Tasks: []
            },
            // ── N2 1.4: Disponibilização ──
            {
              id: "l3-disponibilizacao",
              name: "Disponibilização",
              code: "DISP",
              status: "active",
              businessUnit: "Industrialização e Lançamento",
              description: "Preparar e encaminhar o produto validado para disponibilização, assegurando prontidão operacional, documental, regulatória e comercial.",
              l4Tasks: []
            }
          ]
        },
        // ── N1 2: Funil de Tecnologia ──
        {
          id: "l2-funil-tecnologia",
          name: "Funil de Tecnologia",
          code: "FT",
          description: "Desenvolver e disponibilizar capacidades, insumos, formulações, materiais, embalagens, produtos ampliados, metodologias e modelos necessários para viabilizar a inovação de produtos.",
          businessUnit: "Gerência de Tecnologia e Plataformas",
          l3Processes: [
            { id: "l3-prospeccao", name: "Prospecção e Ideação", code: "PI", status: "active", businessUnit: "", description: "Identificar tendências, necessidades e oportunidades tecnológicas que possam viabilizar novos produtos ou melhorar produtos existentes.", l4Tasks: [] },
            { id: "l3-desenv-insumos", name: "Desenvolvimento de Insumos", code: "DI", status: "active", businessUnit: "", description: "Desenvolver e qualificar insumos necessários para atender aos requisitos de novos produtos.", l4Tasks: [] },
            { id: "l3-tec-ingredientes", name: "Tecnologia de Ingredientes e Formulações", code: "TIF", status: "active", businessUnit: "", description: "Desenvolver ingredientes, formulações e soluções técnicas compatíveis com o conceito e os requisitos do produto.", l4Tasks: [] },
            { id: "l3-desenv-materiais", name: "Desenvolvimento de Materiais e Embalagens", code: "DME", status: "active", businessUnit: "", description: "Desenvolver materiais e embalagens que atendam a design, funcionalidade, proteção, custo, qualidade e sustentabilidade.", l4Tasks: [] },
            { id: "l3-produto-ampliado", name: "Produto Ampliado", code: "PA", status: "active", businessUnit: "", description: "Desenvolver extensões, complementos, experiências ou soluções ampliadas que aumentem o valor entregue pelo produto.", l4Tasks: [] },
            { id: "l3-metodologias", name: "Metodologias e Modelos", code: "MM", status: "active", businessUnit: "", description: "Desenvolver, organizar e disponibilizar metodologias, modelos, padrões e ferramentas para apoiar a inovação e o desenvolvimento de produtos.", l4Tasks: [] }
          ]
        }
      ]
    }
  ];
}
