import type { L1Process } from "@/stores/valueChainStore";

export function buildNaturaValueChain(): L1Process[] {
  return [
    {
      id: "l1-natura",
      name: "Gestão da Inovação",
      namePT: "Gestão da Inovação",
      nameEN: "Innovation Management",
      code: "INOV",
      category: "PRIMARY",
      businessUnit: "Diretoria de Inovação",
      description: "Gerenciar a estratégia, o portfólio e a execução das frentes de inovação da organização, englobando produtos, soluções digitais e novos modelos comerciais.",
      l2Processes: [
        // ── L2 1: Gestão da Inovação de Produtos ──
        {
          id: "l2-inov-produtos",
          name: "Gestão da Inovação de Produtos",
          code: "GNP",
          description: "Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado.",
          businessUnit: "Gerência Executiva de Inovação de Produtos",
          l3Processes: [
            // ── L3 1.1: Funil de Produtos ──
            {
              id: "l3-funil-produtos",
              name: "Funil de Produtos",
              code: "FP",
              description: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.",
              businessUnit: "Gerência de Inovação de Produtos e Gestão de Portfólio",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-conceituacao",
                  name: "Conceituação e Briefing",
                  code: "CB",
                  status: "active",
                  businessUnit: "Conceituação e Briefing",
                  description: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento."
                },
                {
                  id: "l4-prototipagem",
                  name: "Prototipagem",
                  code: "PROT",
                  status: "active",
                  businessUnit: "Laboratório e Formulação",
                  description: "Transformar conceitos aprovados em protótipos de produto, formulação, material ou embalagem para avaliação técnica e de experiência."
                },
                {
                  id: "l4-validacao",
                  name: "Validação",
                  code: "VAL",
                  status: "active",
                  businessUnit: "Segurança e Eficácia",
                  description: "Confirmar que o protótipo atende aos requisitos de consumidor, desempenho, qualidade, segurança, regulatório e viabilidade definidos."
                },
                {
                  id: "l4-disponibilizacao",
                  name: "Disponibilização",
                  code: "DISP",
                  status: "active",
                  businessUnit: "Industrialização e Lançamento",
                  description: "Preparar e encaminhar o produto validado para disponibilização, assegurando prontidão operacional, documental, regulatória e comercial."
                }
              ]
            },
            // ── L3 1.2: Funil de Tecnologia ──
            {
              id: "l3-funil-tecnologia",
              name: "Funil de Tecnologia",
              code: "FT",
              description: "Desenvolver e disponibilizar capacidades, insumos, formulações, materiais, embalagens, produtos ampliados, metodologias e modelos necessários para viabilizar a inovação de produtos.",
              businessUnit: "Gerência de Tecnologia e Plataformas",
              status: "active",
              l4Tasks: [
                { id: "l4-prospeccao", name: "Prospecção e Ideação", code: "PI", status: "active", businessUnit: "", description: "Identificar tendências, necessidades e oportunidades tecnológicas que possam viabilizar novos produtos ou melhorar produtos existentes" },
                { id: "l4-desenv-insumos", name: "Desenvolvimento de Insumos", code: "DI", status: "active", businessUnit: "", description: "Desenvolver e qualificar insumos necessários para atender aos requisitos de novos produtos" },
                { id: "l4-tec-ingredientes", name: "Tecnologias de Ingredientes e Formulações", code: "TIF", status: "active", businessUnit: "", description: "Desenvolver ingredientes, formulações e soluções técnicas compatíveis com o conceito e os requisitos do produto" },
                { id: "l4-desenv-materiais", name: "Desenvolvimento de Materiais e Embalagens", code: "DME", status: "active", businessUnit: "", description: "Desenvolver materiais e embalagens que atendam a design, funcionalidade, proteção, custo, qualidade e sustentabilidade" },
                { id: "l4-produto-ampliado", name: "Produto Ampliado", code: "PA", status: "active", businessUnit: "", description: "Desenvolver extensões, complementos, experiências ou soluções ampliadas que aumentem o valor entregue pelo produto" },
                { id: "l4-metodologias", name: "Metodologias e Modelos", code: "MM", status: "active", businessUnit: "", description: "Desenvolver, organizar e disponibilizar metodologias, modelos, padrões e ferramentas para apoiar a inovação e o desenvolvimento de produtos" }
              ]
            }
          ]
        },

        // ── L2 2: Inovação Digital ──
        {
          id: "l2-inov-digital",
          name: "Inovação Digital",
          code: "IDIG",
          description: "Desenvolver soluções, plataformas e produtos digitais que potencializem a experiência de consultoras, consumidores e canais de relacionamento.",
          businessUnit: "Gerência Executiva de Produtos Digitais",
          l3Processes: [
            {
              id: "l3-plataformas-digitais",
              name: "Plataformas e Experiências Digitais",
              code: "PED",
              description: "Conceber e evoluir ecossistemas digitais, aplicativos e serviços omnichannel.",
              businessUnit: "Canais Digitais",
              status: "active",
              l4Tasks: [
                { id: "l4-app-consultoria", name: "Evolução do App da Consultoria", code: "L4-ID1", status: "active", businessUnit: "Mobile", description: "Melhorias contínuas e novos recursos de venda para as consultoras de beleza." },
                { id: "l4-checkout-digital", name: "Jornadas Digitais e Checkout Omnichannel", code: "L4-ID2", status: "active", businessUnit: "E-commerce", description: "Otimização de checkout, meios de pagamento e integração física-digital." }
              ]
            },
            {
              id: "l3-ia-dados",
              name: "Inteligência Artificial e Produtos de Dados",
              code: "IAD",
              description: "Desenvolver modelos de recomendação, personalização e automação cognitiva para os negócios.",
              businessUnit: "Data & AI",
              status: "active",
              l4Tasks: [
                { id: "l4-motor-recomendacao", name: "Motor de Recomendação Personalizada", code: "L4-ID3", status: "active", businessUnit: "Data Science", description: "Algoritmos preditivos de cesta de compras e ofertas sob medida." }
              ]
            }
          ]
        },

        // ── L2 3: Gestão da Inovação de Modelo Comercial ──
        {
          id: "l2-inov-modelo-comercial",
          name: "Gestão da Inovação de Modelo Comercial",
          code: "GIMC",
          description: "Desenvolver, testar e escalar novos modelos de negócio, formatos de remuneração, canais de relacionamento e estratégias de go-to-market.",
          businessUnit: "Gerência Executiva de Novos Modelos Comerciais",
          l3Processes: [
            {
              id: "l3-novos-canais",
              name: "Novos Canais e Modelos de Relação",
              code: "NCMR",
              description: "Explorar franquias digitais, social commerce e novos formatos de distribuição.",
              businessUnit: "Novos Negócios",
              status: "active",
              l4Tasks: [
                { id: "l4-social-commerce", name: "Social Commerce e Venda por Afiliados", code: "L4-MC1", status: "active", businessUnit: "Social Commerce", description: "Plataforma de revenda via redes sociais e influenciadores digitais." },
                { id: "l4-hub-parcerias", name: "Hub de Parcerias e Ecossistemas Comerciais", code: "L4-MC2", status: "active", businessUnit: "Parcerias", description: "Acordos comerciais com varejistas e plataformas de fidelidade externas." }
              ]
            },
            {
              id: "l3-remuneracao-incentivos",
              name: "Evolução do Modelo de Remuneração e Incentivos",
              code: "EMRI",
              description: "Modelar planos de crescimento e recompensas para a rede de relações comerciais.",
              businessUnit: "Estratégia Comercial",
              status: "active",
              l4Tasks: [
                { id: "l4-gamificacao-vendas", name: "Gamificação e Programas de Reconhecimento", code: "L4-MC3", status: "active", businessUnit: "Engajamento", description: "Dinâmicas de gamificação e campanhas de aceleração de resultados." }
              ]
            }
          ]
        }
      ]
    }
  ];
}
