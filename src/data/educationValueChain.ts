// Mocked value chain based on the client's reference map.
// L1 = Domínio · L2 = Jornada (por unidade de negócio)
import type { L1Process, L2Process, L3Process, L4Task } from "@/stores/valueChainStore";

const id = () => Math.random().toString(36).substr(2, 9);

const SOMOS = "SOMOS/Saber";
const SABER = "Red Ballon";
const JOVEM = "PROFS";
const LIFELONG = "PROFS";

export const EDUCATION_BUSINESS_UNITS = [SOMOS, SABER, JOVEM];

const jornada = (
  name: string,
  businessUnit: string,
  macroprocessos: L3Process[] = []
): L2Process => ({
  id: id(),
  name,
  description: `Jornada de ${businessUnit}`,
  businessUnit,
  l3Processes: macroprocessos,
});

const macro = (name: string, businessUnit: string, processos: string[]): L3Process => ({
  id: id(),
  name,
  description: `Macroprocesso da Jornada de Construção do Produto`,
  businessUnit,
  status: "active",
  l4Tasks: processos.map<L4Task>((p) => ({
    id: id(),
    name: p,
    businessUnit,
    status: "active",
  })),
});

/** Macroprocessos e processos da Jornada "Construção do Produto" (SOMOS / Saber). */
export const CONSTRUCAO_PRODUTO_MACROS: Array<{ macro: string; processos: string[] }> = [
  {
    macro: "Planejar e monitorar o ciclo de produção de conteúdo",
    processos: [
      "Planejar e monitorar o ciclo de produção editorial",
      "Definir portfólio e elaborar orçamentos",
      "Realizar contratação de autores",
      "Realizar contratação de elaboradores de conteúdo",
      "Realizar contratação de equipes externas",
      "Planejar e monitorar orçamento do ciclo editorial",
    ],
  },
  {
    macro: "Elaborar conteúdo",
    processos: [
      "Produzir Originais",
      "Elaborar Projeto Gráfico",
      "Realizar edição de texto",
      "Realizar leitura crítica",
      "Produzir conteúdo multimídia",
      "Produzir objetos de ensino digitais (OEDs) e materiais complementares",
      "Realizar licenciamento de textos e imagens",
      "Produzir mapas e ilustrações",
      "Realizar provas de conteúdo diagramado",
      "Construir versão HTML de obras",
      "Realizar ajustes e correções em materiais produzidos",
      "Realizar produção de conteúdo (Ensino Adaptativo)",
    ],
  },
];


const dominio = (
  name: string,
  category: "PRIMARY" | "SUPPORT",
  jornadas: L2Process[]
): L1Process => ({
  id: id(),
  name,
  nameEN: name,
  namePT: name,
  category,
  description: `Domínio ${name}`,
  l2Processes: jornadas,
});

export function buildEducationValueChain(): L1Process[] {
  return [
    dominio("Conteúdo", "PRIMARY", [
      jornada(
        "Construção do Produto",
        SOMOS,
        CONSTRUCAO_PRODUTO_MACROS.map((m) => macro(m.macro, SOMOS, m.processos))
      ),

      jornada("Portfólio de Produtos Acadêmicos e Obras", SOMOS),
      jornada("Implantação e Acompanhamento de Produtos", SOMOS),
    ]),

    dominio("Crescimento", "PRIMARY", [
      jornada("Comercial", SOMOS),
      jornada("Planejamento do Ciclo Comercial", SOMOS),
      jornada("Comercial", SABER),
      jornada("Planejamento do Ciclo Comercial", SABER),
      jornada("Suporte Comercial Cross", SABER),
      jornada("Expansão de Unidades e Redes Parceiras", SABER),
      jornada("Trade Marketing", SABER),
      jornada("Portfólio de Cursos Ofertados", SABER),
      jornada("Gestão de Canais Comerciais Cross", SABER),
      jornada("Comercial", JOVEM),
      jornada("Comercial", LIFELONG),
    ]),

    dominio("Gestão e Sup. à Operação", "SUPPORT", [
      jornada("Gestão da Operação de Unidades e Rede Parceira", SABER),
      jornada("Inteligência e Governança da Operação", SABER),
      jornada("Planej. e Gestão da Carga Horária", SABER),
      jornada("Gestão da Infraestrutura de Unidades", SABER),
      jornada("Gestão Administrativa do Aluno", SABER),
    ]),

    dominio("Experiência", "PRIMARY", [
      jornada("Relacionamento e Retenção", SOMOS),
      jornada("Suporte ao Professor", SOMOS),
      jornada("Operações Acadêmicas", SABER),
      jornada("Atendimento", SABER),
      jornada("Suporte ao Cliente", JOVEM),
      jornada("Relacionamento e Suporte ao Ecossistema", LIFELONG),
      jornada("Suporte Acadêmico", LIFELONG),
    ]),

    dominio("Produção e Logística", "PRIMARY", [
      jornada("Planejamento e Produção", SOMOS),
      jornada("Distribuição", SOMOS),
    ]),

    dominio("Design Soluções", "PRIMARY", [
      jornada("Operacionalização do Modelo de Negócio", JOVEM),
    ]),

    dominio("Design Plataforma", "PRIMARY", [
      jornada("Desenvolvimento e Evolução da Plataforma", LIFELONG),
    ]),
  ];
}
