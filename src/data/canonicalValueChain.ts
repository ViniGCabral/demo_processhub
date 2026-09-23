import type { L1Process } from "@/stores/valueChainStore";

export function buildDemoValueChain(): L1Process[] {
  return [
    // ══════════════════════════════════════════════════════════
    // CENÁRIO 1: DOMÍNIO PRINCIPAL COMPLETO — GESTÃO COMERCIAL
    // ══════════════════════════════════════════════════════════
    {
      id: "l1-gestao-comercial",
      name: "Gestão Comercial",
      namePT: "Gestão Comercial",
      nameEN: "Commercial Management",
      code: "COM",
      category: "PRIMARY",
      businessUnit: "Divisão Corporativa",
      responsible: "Mariana Vasconcelos — Diretora Comercial",
      description: "Cadeia primária de geração de receita, prospecção de contas B2B, negociação de propostas, formalização contratual e passagem de bastão para Customer Success.",
      l2Processes: [
        {
          id: "l2-prospeccao",
          name: "Prospecção e Qualificação",
          code: "COM.1",
          description: "Geração de demanda inbound, prospecção ativa outbound e qualificação de oportunidades comerciais.",
          businessUnit: "Divisão Corporativa",
          responsible: "Lucas Nogueira",
          l3Processes: [
            {
              id: "l3-geracao-leads",
              name: "Geração e Enriquecimento de Leads",
              code: "COM.1.1",
              description: "Captação de leads via canais digitais e prospecção de contas no Perfil de Cliente Ideal (ICP).",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-inbound",
                  name: "Captação e Triagem Inbound",
                  code: "COM.1.1.1",
                  description: "Triagem de MQLs gerados via formulários e inbound marketing.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                },
                {
                  id: "l4-outbound",
                  name: "Prospecção Ativa Outbound",
                  code: "COM.1.1.2",
                  description: "Mapeamento de decisores em contas corporativas e cadência ativa de prospecção.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            },
            {
              id: "l3-qualificacao-sdr",
              name: "Qualificação e Agendamento (SDR)",
              code: "COM.1.2",
              description: "Diagnóstico inicial de dores (metodologia BANT) e passagem para executivos de vendas.",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-reunioes",
                  name: "Agendamento de Demonstrações",
                  code: "COM.1.2.1",
                  description: "Alinhamento de agenda técnica com Account Executives e confirmação de presença.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            }
          ]
        },
        {
          id: "l2-negociacao",
          name: "Negociação e Fechamento",
          code: "COM.2",
          description: "Estruturação de propostas de valor, precificação, aprovação de alçadas e assinatura digital de contratos.",
          businessUnit: "Divisão Corporativa",
          responsible: "Mariana Vasconcelos",
          l3Processes: [
            {
              id: "l3-proposta",
              name: "Elaboração de Propostas e Precificação",
              code: "COM.2.1",
              description: "Cálculo de margem, concessão de descontos e apresentação executiva.",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-calc-preco",
                  name: "Precificação e Margem Comercial",
                  code: "COM.2.1.1",
                  description: "Simulação de margem de contribuição e aprovação de alçadas comerciais.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                },
                {
                  id: "l4-envio-prop",
                  name: "Envio e Apresentação de Proposta",
                  code: "COM.2.1.2",
                  description: "Defesa técnica de escopo e cronograma de entrega junto aos decisores do cliente.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            },
            {
              id: "l3-fechamento",
              name: "Formalização Contratual",
              code: "COM.2.2",
              description: "Minutas contratuais, coleta de assinaturas eletrônicas com validade jurídica e liberação para faturamento.",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-contrato-com",
                  name: "Assinatura Digital de Contrato",
                  code: "COM.2.2.1",
                  description: "Disparo e acompanhamento de envelopes via DocuSign.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                },
                {
                  id: "l4-onboarding-pass",
                  name: "Passagem de Bastão Comercial",
                  code: "COM.2.2.2",
                  description: "Transferência das premissas e acordos comerciais para o time de implantação.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            }
          ]
        },
        {
          id: "l2-pos-venda",
          name: "Pós-Venda e Sucesso do Cliente",
          code: "COM.3",
          description: "Acompanhamento do ciclo de vida, kickoff de adoção, renovação e expansão de receita (upsell).",
          businessUnit: "Divisão Corporativa",
          responsible: "Beatriz Fontes",
          l3Processes: [
            {
              id: "l3-onboarding-cs",
              name: "Ativação e Adoção Inicial",
              code: "COM.3.1",
              description: "Treinamentos, configuração do ambiente e garantia do primeiro valor (Time-to-Value).",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-kickoff",
                  name: "Kickoff e Adoção do Cliente",
                  code: "COM.3.1.1",
                  description: "Reunião de início de projeto e validação de cronograma com sponsors do cliente.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                },
                {
                  id: "l4-treinamento",
                  name: "Treinamento de Usuários-Chave",
                  code: "COM.3.1.2",
                  description: "Workshops de capacitação para usuários finais e administradores da solução.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            },
            {
              id: "l3-expansao",
              name: "Gestão de Renovação e Expansão",
              code: "COM.3.2",
              description: "Acompanhamento de métricas de uso (NPS, Health Score) e renovações contratuais anuais.",
              businessUnit: "Divisão Corporativa",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-renovacao",
                  name: "Renovação Contratual de Clientes",
                  code: "COM.3.2.1",
                  description: "Negociação de reajustes anuais e aditivos de expansão de escopo.",
                  businessUnit: "Divisão Corporativa",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CENÁRIO 2: DOMÍNIO PARCIALMENTE PREENCHIDO — SUPRIMENTOS
    // ══════════════════════════════════════════════════════════
    {
      id: "l1-suprimentos",
      name: "Suprimentos e Logística",
      namePT: "Suprimentos e Logística",
      nameEN: "Procurement & Logistics",
      code: "SUP",
      category: "PRIMARY",
      businessUnit: "Divisão de Suprimentos",
      responsible: "Carlos Eduardo Mendes — Diretor de Operações",
      description: "Planejamento de compras, homologação e auditoria de fornecedores estratégicos, aquisição de materiais e gestão logística de ponta a ponta.",
      l2Processes: [
        {
          id: "l2-compras",
          name: "Gestão de Compras",
          code: "SUP.1",
          description: "Cotações estratégicas, negociação de volume e emissão de pedidos de compra.",
          businessUnit: "Divisão de Suprimentos",
          l3Processes: [
            {
              id: "l3-comp-estrat",
              name: "Compras Estratégicas",
              code: "SUP.1.1",
              description: "Sourcing estratégico para matérias-primas e serviços corporativos.",
              businessUnit: "Divisão de Suprimentos",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-cotacao-estrat",
                  name: "Cotação de Materiais Estratégicos",
                  code: "SUP.1.1.1",
                  description: "Equalização técnica de cotações de insumos.",
                  businessUnit: "Divisão de Suprimentos",
                  status: "active",
                },
                {
                  id: "l4-negociacao-po",
                  name: "Negociação e Pedido de Compra",
                  code: "SUP.1.1.2",
                  description: "Formalização do pedido via SAP Ariba.",
                  businessUnit: "Divisão de Suprimentos",
                  status: "active",
                }
              ]
            }
          ]
        },
        {
          id: "l2-fornecedores",
          name: "Gestão de Fornecedores",
          code: "SUP.2",
          description: "Homologação cadastral, avaliação de conformidade e auditoria de SLA de entrega.",
          businessUnit: "Divisão de Suprimentos",
          l3Processes: [
            {
              id: "l3-homologacao",
              name: "Homologação e Cadastro",
              code: "SUP.2.1",
              description: "Conferência de documentação jurídica, fiscal e técnica.",
              businessUnit: "Divisão de Suprimentos",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-qualif-forn",
                  name: "Qualificação e Homologação",
                  code: "SUP.2.1.1",
                  description: "Validação de certidões negativas e compliance.",
                  businessUnit: "Divisão de Suprimentos",
                  status: "active",
                }
              ]
            },
            {
              id: "l3-avaliacao-sla",
              name: "Monitoramento de Desempenho",
              code: "SUP.2.2",
              description: "Avaliação do cumprimento de prazos e qualidade acordados.",
              businessUnit: "Divisão de Suprimentos",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-auditoria-forn",
                  name: "Auditoria de Desempenho de Fornecedores",
                  code: "SUP.2.2.1",
                  description: "Avaliação de conformidade periódica.",
                  businessUnit: "Divisão de Suprimentos",
                  status: "active",
                },
                {
                  id: "l4-planos-acao",
                  name: "Planos de Ação e Melhoria Contínua",
                  code: "SUP.2.2.2",
                  description: "Planos corretivos para desvios de SLA.",
                  businessUnit: "Divisão de Suprimentos",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // CENÁRIO 3: DOMÍNIO EM ESTRUTURAÇÃO / BAIXA COBERTURA — TI
    // ══════════════════════════════════════════════════════════
    {
      id: "l1-ti",
      name: "Tecnologia da Informação",
      namePT: "Tecnologia da Informação",
      nameEN: "Information Technology",
      code: "IT",
      category: "SUPPORT",
      businessUnit: "Serviços Corporativos",
      responsible: "Renata Silveira — Gerente de TI",
      description: "Governança tecnológica, sustentação de infraestrutura em nuvem, gestão de sistemas legados e segurança da informação.",
      l2Processes: [
        {
          id: "l2-ti-infra",
          name: "Infraestrutura e Redes",
          code: "IT.1",
          description: "Administração de redes locais, conectividade corporativa e servidores cloud.",
          businessUnit: "Serviços Corporativos",
          l3Processes: [
            {
              id: "l3-ti-cloud",
              name: "Gestão de Nuvem e Servidores",
              code: "IT.1.1",
              description: "Dimensionamento e monitoramento de instâncias na nuvem.",
              businessUnit: "Serviços Corporativos",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-ti-provisioning",
                  name: "Provisionamento de Recursos Cloud",
                  code: "IT.1.1.1",
                  description: "Configuração de máquinas e instâncias sob demanda.",
                  businessUnit: "Serviços Corporativos",
                  status: "active",
                }
              ]
            }
          ]
        },
        {
          id: "l2-ti-sistemas",
          name: "Sistemas Corporativos",
          code: "IT.2",
          description: "Suporte aos sistemas de negócio (ERP, CRM, Folha) e atendimento N3.",
          businessUnit: "Serviços Corporativos",
          l3Processes: [
            {
              id: "l3-ti-sustentacao",
              name: "Sustentação e Suporte N3",
              code: "IT.2.1",
              description: "Resolução de chamados de alta complexidade e correção de bugs.",
              businessUnit: "Serviços Corporativos",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-ti-chamados",
                  name: "Atendimento a Incidentes Críticos",
                  code: "IT.2.1.1",
                  description: "Tratamento de indisponibilidades em sistemas corporativos.",
                  businessUnit: "Serviços Corporativos",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    },

    // ══════════════════════════════════════════════════════════
    // DOMÍNIOS DE SUPORTE
    // ══════════════════════════════════════════════════════════
    {
      id: "l1-juridico",
      name: "Jurídico",
      namePT: "Jurídico",
      nameEN: "Legal Affairs",
      code: "JUR",
      category: "SUPPORT",
      businessUnit: "Corporativo",
      responsible: "Dr. Roberto Meireles — Diretor Jurídico",
      description: "Consultoria legal preventiva, gestão do contencioso cível e trabalhista, e conformidade regulatória corporativa.",
      l2Processes: [
        {
          id: "l2-contencioso",
          name: "Contencioso e Consultivo",
          code: "JUR.1",
          description: "Defesa judicial e pareceres preventivos para novos contratos.",
          businessUnit: "Corporativo",
          l3Processes: [
            {
              id: "l3-trab-civel",
              name: "Trabalhista e Cível",
              code: "JUR.1.1",
              description: "Acompanhamento processual e audiências.",
              businessUnit: "Corporativo",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-trab",
                  name: "Defesa Trabalhista",
                  code: "JUR.1.1.1",
                  description: "Elaboração de peças de defesa e audiências.",
                  businessUnit: "Corporativo",
                  status: "active",
                },
                {
                  id: "l4-acordos",
                  name: "Mediação de Acordos",
                  code: "JUR.1.1.2",
                  description: "Acordos judiciais e transações preventivas.",
                  businessUnit: "Corporativo",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "l1-rh",
      name: "Recursos Humanos",
      namePT: "Recursos Humanos",
      nameEN: "Human Resources",
      code: "RH",
      category: "SUPPORT",
      businessUnit: "Gente e Gestão",
      responsible: "Beatriz Fontes — Diretora de RH",
      description: "Gestão do ciclo de vida dos colaboradores, atração de talentos, treinamento, remuneração e administração de folha.",
      l2Processes: [
        {
          id: "l2-ta",
          name: "Aquisição de Talentos",
          code: "RH.1",
          description: "Captação, triagem e contratação de profissionais para as unidades de negócio.",
          businessUnit: "Gente e Gestão",
          l3Processes: [
            {
              id: "l3-rs",
              name: "Recrutamento e Seleção",
              code: "RH.1.1",
              description: "Triagem e condução de entrevistas técnicas.",
              businessUnit: "Gente e Gestão",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-atracao",
                  name: "Atração e Seleção",
                  code: "RH.1.1.1",
                  description: "Seleção e contratação de talentos.",
                  businessUnit: "Gente e Gestão",
                  status: "active",
                }
              ]
            }
          ]
        },
        {
          id: "l2-admp",
          name: "Administração de Pessoal",
          code: "RH.2",
          description: "Rotinas admissionais, folha de pagamento e benefícios corporativos.",
          businessUnit: "Gente e Gestão",
          l3Processes: [
            {
              id: "l3-admissao",
              name: "Admissão e Integração",
              code: "RH.2.1",
              description: "Processamento de novos colaboradores e entrega de crachás/acessos.",
              businessUnit: "Gente e Gestão",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-onboarding-rh",
                  name: "Admissão e Onboarding",
                  code: "RH.2.1.1",
                  description: "Coleta de documentos e integração.",
                  businessUnit: "Gente e Gestão",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: "l1-fin",
      name: "Financeiro",
      namePT: "Financeiro",
      nameEN: "Finance & Treasury",
      code: "FIN",
      category: "SUPPORT",
      businessUnit: "Finanças e Controladoria",
      responsible: "Arthur Antunes — Gerente Financeiro",
      description: "Controladoria, contas a pagar, contas a receber, tesouraria e conciliação bancária.",
      l2Processes: [
        {
          id: "l2-cap",
          name: "Contas a Pagar e Tesouraria",
          code: "FIN.1",
          description: "Controle de notas fiscais, liquidação e envio de remessas a bancos.",
          businessUnit: "Finanças e Controladoria",
          l3Processes: [
            {
              id: "l3-pagforn",
              name: "Pagamento a Fornecedores",
              code: "FIN.1.1",
              description: "Conferência e pagamento no prazo acordado.",
              businessUnit: "Finanças e Controladoria",
              status: "active",
              l4Tasks: [
                {
                  id: "l4-liquidacao",
                  name: "Liquidação Financeira",
                  code: "FIN.1.1.1",
                  description: "Baixa e liquidação de títulos no ERP.",
                  businessUnit: "Finanças e Controladoria",
                  status: "active",
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}
