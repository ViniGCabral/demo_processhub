
import type { L1Process } from "@/stores/valueChainStore";

export function buildNaturaValueChain(): L1Process[] {
  return [
    {
      id: "l1-natura",
      name: "Gestão da Inovação de Produtos",
      namePT: "Gestão da Inovação de Produtos",
      nameEN: "Gestão da Inovação de Produtos",
      code: "GNP",
      category: "PRIMARY",
      businessUnit: "",
      description: "Gerenciar a evolução do portfólio de produtos, transformando oportunidades de mercado, necessidades dos consumidores e capacidades tecnológicas em produtos inovadores, viáveis, seguros e disponibilizados para o mercado.",
      l2Processes: [
        {
          id: "l2-funil-produtos",
          name: "Funil de Produtos",
          code: "FP",
          description: "Conduzir oportunidades de produto por etapas estruturadas de conceituação, prototipagem, validação e disponibilização, permitindo decisões progressivas de investimento e continuidade.",
          businessUnit: "",
          l3Processes: [
            {
              id: "l3-conceituacao",
              name: "Conceituação e Briefing",
              code: "CB",
              description: "Transformar oportunidades em conceitos de produto estruturados, avaliados e documentados, com proposta de valor, diretrizes técnicas, requisitos de qualidade, impactos ambientais, viabilidade financeira e decisão de passagem para desenvolvimento.",
              businessUnit: "",
              status: "active",
              l4Tasks: [
                { id: "l4-1", name: "Identificar oportunidades para o negócio", code: "L4.1", status: "active", businessUnit: "" }, { id: "l4-2", name: "Desenvolver conceito e proposta de valor", code: "L4.2", status: "active", businessUnit: "" }, { id: "l4-3", name: "Pesquisar e validar conceito e proposta de valor", code: "L4.3", status: "active", businessUnit: "" }, { id: "l4-4", name: "Definir design de produto — Qualidade, DLL e Regulatório", code: "L4.4", status: "active", businessUnit: "" }, { id: "l4-5", name: "Desenhar arquitetura de portfólio", code: "L4.5", status: "active", businessUnit: "" }, { id: "l4-6", name: "Definir diretrizes de design", code: "L4.6", status: "active", businessUnit: "" }, { id: "l4-7", name: "Definir diretrizes de qualidade", code: "L4.7", status: "active", businessUnit: "" }, { id: "l4-8", name: "Avaliar impacto ambiental", code: "L4.8", status: "active", businessUnit: "" }, { id: "l4-9", name: "Construir o business case (BC)", code: "L4.9", status: "active", businessUnit: "" }, { id: "l4-10", name: "Realizar análise financeira", code: "L4.10", status: "active", businessUnit: "" }, { id: "l4-11", name: "Criar projeto no sistema e carregar informações estratégicas", code: "L4.11", status: "active", businessUnit: "" }, { id: "l4-12", name: "Realizar Gate BF — aprovação e passagem para kick-off técnico", code: "L4.12", status: "active", businessUnit: "" }
              ]
            },
            { id: "l3-prototipagem", name: "Prototipagem", code: "PROT", status: "active", businessUnit: "", description: "Transformar conceitos aprovados em protótipos de produto, formulação, material ou embalagem para avaliação técnica e de experiência.", l4Tasks: [] },
            { id: "l3-validacao", name: "Validação", code: "VAL", status: "active", businessUnit: "", description: "Confirmar que o protótipo atende aos requisitos de consumidor, desempenho, qualidade, segurança, regulatório e viabilidade definidos.", l4Tasks: [] },
            { id: "l3-disponibilizacao", name: "Disponibilização", code: "DISP", status: "active", businessUnit: "", description: "Preparar e encaminhar o produto validado para disponibilização, assegurando prontidão operacional, documental, regulatória e comercial.", l4Tasks: [] }
          ]
        },
        {
          id: "l2-funil-tecnologia",
          name: "Funil de Tecnologia",
          code: "FT",
          description: "Desenvolver e disponibilizar capacidades, insumos, formulações, materiais, embalagens, produtos ampliados, metodologias e modelos necessários para viabilizar a inovação de produtos.",
          businessUnit: "",
          l3Processes: [
            { id: "l3-prospeccao", name: "Prospecção e Ideação", code: "PI", status: "active", businessUnit: "", description: "Identificar tendências, necessidades e oportunidades tecnológicas que possam viabilizar novos produtos ou melhorar produtos existentes", l4Tasks: [] },
            { id: "l3-desenv-insumos", name: "Desenvolvimento de Insumos", code: "DI", status: "active", businessUnit: "", description: "Desenvolver e qualificar insumos necessários para atender aos requisitos de novos produtos", l4Tasks: [] },
            { id: "l3-tec-ingredientes", name: "Tecnologias de Ingredientes e Formulações", code: "TIF", status: "active", businessUnit: "", description: "Desenvolver ingredientes, formulações e soluções técnicas compatíveis com o conceito e os requisitos do produto", l4Tasks: [] },
            { id: "l3-desenv-materiais", name: "Desenvolvimento de Materiais e Embalagens", code: "DME", status: "active", businessUnit: "", description: "Desenvolver materiais e embalagens que atendam a design, funcionalidade, proteção, custo, qualidade e sustentabilidade", l4Tasks: [] },
            { id: "l3-produto-ampliado", name: "Produto Ampliado", code: "PA", status: "active", businessUnit: "", description: "Desenvolver extensões, complementos, experiências ou soluções ampliadas que aumentem o valor entregue pelo produto", l4Tasks: [] },
            { id: "l3-metodologias", name: "Metodologias e Modelos", code: "MM", status: "active", businessUnit: "", description: "Desenvolver, organizar e disponibilizar metodologias, modelos, padrões e ferramentas para apoiar a inovação e o desenvolvimento de produtos", l4Tasks: [] }
          ]
        }
      ]
    }
  ];
}
