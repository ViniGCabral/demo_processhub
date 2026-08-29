import type { Participant, ProcessLearningContent, TrainingGroup, TrainingProcess } from "./types";

export const academyProcesses: TrainingProcess[] = [
  {
    id: "consultar-conta", name: "Consultar conta contábil", code: "CONT-001", area: "Contabilidade",
    valueChain: "Gestão Financeira", owner: "Mariana Oliveira", sopVersion: "v3.2", updatedAt: "18/08/2026",
    minutes: 18, objective: "Consultar contas contábeis com segurança e identificar sua aplicação correta.",
    expectedResult: "Conta localizada, validada e registrada conforme o plano de contas vigente.", systems: ["SAP S/4HANA", "Portal Contábil"],
    required: true, status: "Concluído", progress: 100, score: 90,
  },
  {
    id: "criar-conta", name: "Criar conta contábil", code: "CONT-002", area: "Contabilidade",
    valueChain: "Gestão Financeira", owner: "Mariana Oliveira", sopVersion: "v2.4", updatedAt: "22/08/2026",
    minutes: 25, objective: "Criar contas contábeis de acordo com critérios, aprovações e controles estabelecidos.",
    expectedResult: "Nova conta criada, aprovada e disponível para uso sem inconsistências.", systems: ["SAP S/4HANA", "ServiceNow"],
    required: true, status: "Em andamento", progress: 60,
  },
  {
    id: "alterar-conta", name: "Alterar conta contábil", code: "CONT-003", area: "Contabilidade",
    valueChain: "Gestão Financeira", owner: "Paulo Nunes", sopVersion: "v2.1", updatedAt: "12/08/2026",
    minutes: 20, objective: "Atualizar atributos de contas contábeis mantendo rastreabilidade e conformidade.",
    expectedResult: "Alteração aplicada e evidenciada após as aprovações obrigatórias.", systems: ["SAP S/4HANA"],
    required: true, status: "Não iniciado", progress: 0,
  },
  {
    id: "revisar-plano", name: "Revisar estrutura do plano de contas", code: "CONT-004", area: "Contabilidade",
    valueChain: "Gestão Financeira", owner: "Mariana Oliveira", sopVersion: "v1.8", updatedAt: "05/08/2026",
    minutes: 30, objective: "Revisar periodicamente a estrutura e identificar contas redundantes ou inadequadas.",
    expectedResult: "Plano de contas revisado, consistente e aprovado pela governança contábil.", systems: ["SAP S/4HANA", "Power BI"],
    required: false, status: "Não iniciado", progress: 0,
  },
];

export const academyParticipants: Participant[] = [
  { id: "ana", name: "Ana Souza", role: "Analista de Plano de Contabilidade", area: "Contabilidade", email: "ana.souza@empresa.com", progress: 75, score: 88, status: "Em andamento", lastActivity: "Hoje, 09:42" },
  { id: "bruno", name: "Bruno Lima", role: "Analista de Plano de Contabilidade", area: "Contabilidade", email: "bruno.lima@empresa.com", progress: 50, score: 76, status: "Reforço necessário", lastActivity: "Ontem, 16:20" },
  { id: "carla", name: "Carla Mendes", role: "Analista de Plano de Contabilidade", area: "Contabilidade", email: "carla.mendes@empresa.com", progress: 100, score: 94, status: "Concluído", lastActivity: "27/08/2026" },
  { id: "daniel", name: "Daniel Rocha", role: "Analista de Plano de Contabilidade", area: "Contabilidade", email: "daniel.rocha@empresa.com", progress: 25, status: "Atrasado", lastActivity: "21/08/2026" },
  { id: "julia", name: "Júlia Freitas", role: "Assistente Contábil", area: "Contabilidade", email: "julia.freitas@empresa.com", progress: 0, status: "Não iniciado", lastActivity: "—" },
];

export const initialGroup: TrainingGroup = {
  id: "plano-contabilidade", name: "Analistas de Plano de Contabilidade",
  description: "Formação operacional para o time responsável pela gestão do plano de contas.",
  role: "Analista de Plano de Contabilidade", department: "Contabilidade",
  objective: "Capacitar os analistas para consultar, validar, criar e atualizar contas contábeis seguindo os procedimentos e controles definidos.",
  owner: "Mariana Oliveira", status: "Publicado", dueDate: "2026-09-30", passingScore: 80, maxAttempts: 3,
  allowRetries: true, requireReading: true, requireAcknowledgment: true, requireQuiz: true, issueCertificate: true,
  participantIds: ["ana", "bruno", "carla", "daniel"], processIds: academyProcesses.map((p) => p.id),
};

export const learningSteps = [
  { title: "Receber e validar a solicitação", description: "Confirme o motivo da criação, a empresa, o tipo de conta e a documentação anexada.", owner: "Analista contábil", system: "ServiceNow", input: "Solicitação aprovada", output: "Dados validados", evidence: "Checklist preenchido", attention: "A solicitação deve conter aprovação da controladoria." },
  { title: "Pesquisar contas equivalentes", description: "Consulte o plano vigente para evitar duplicidade e validar o agrupamento correto.", owner: "Analista contábil", system: "SAP S/4HANA", input: "Dados da solicitação", output: "Parecer de não duplicidade", evidence: "Captura da consulta", attention: "Compare descrição, natureza e grupo de contas." },
  { title: "Cadastrar a nova conta", description: "Preencha os atributos obrigatórios conforme a classificação aprovada.", owner: "Analista contábil", system: "SAP S/4HANA", input: "Parecer validado", output: "Conta em aprovação", evidence: "Número provisório", attention: "Revise moeda, tipo e bloqueios antes de salvar." },
  { title: "Obter aprovação e comunicar", description: "Encaminhe para aprovação e informe o solicitante após a ativação.", owner: "Coordenação contábil", system: "SAP S/4HANA", input: "Conta cadastrada", output: "Conta ativa", evidence: "Registro de aprovação", attention: "A conta só pode ser utilizada depois da aprovação final." },
];

export const quizQuestions = [
  { statement: "Qual é a primeira verificação antes de criar uma conta?", options: ["Validar a solicitação e aprovações", "Ativar a conta", "Comunicar o solicitante", "Excluir contas antigas"], correct: 0, explanation: "A validação da solicitação e das aprovações antecede qualquer cadastro.", reference: "Etapa 1 — Receber e validar" },
  { statement: "É necessário pesquisar contas equivalentes para evitar duplicidade.", options: ["Verdadeiro", "Falso"], correct: 0, explanation: "A consulta ao plano vigente é um controle obrigatório contra duplicidades.", reference: "Etapa 2 — Pesquisar contas equivalentes" },
  { statement: "Quando a nova conta pode ser utilizada?", options: ["Logo após o preenchimento", "Após a aprovação final", "Antes da validação", "Somente no mês seguinte"], correct: 1, explanation: "A conta fica disponível apenas depois da aprovação final.", reference: "Etapa 4 — Obter aprovação" },
];

export function createDefaultLearningContent(process: TrainingProcess): ProcessLearningContent {
  return {
    processId: process.id,
    overview: {
      objective: process.objective,
      expectedResult: process.expectedResult,
      frequency: "Sob demanda",
      userRole: "Analista responsável pela validação e execução",
      systems: process.systems.join(", "),
      inputs: "Solicitação e aprovações",
      outputs: "Conta validada ou atualizada",
      averageTime: `${process.minutes} minutos`,
    },
    beforeYouStart: [
      "Acesso ativo ao SAP S/4HANA",
      "Perfil autorizado no ServiceNow",
      "Solicitação com campos obrigatórios",
      "Aprovação da controladoria",
      "Documentos de suporte anexados",
      "Dados da empresa e classificação contábil",
    ],
    attentionPoints: learningSteps.map((step) => ({ title: step.title, description: step.attention })),
    operationalSummary: {
      essentials: "Validar, pesquisar duplicidade, cadastrar e obter aprovação.",
      owners: "Analista e coordenação contábil",
      systems: process.systems.join(", "),
      approvals: "Controladoria e coordenação contábil",
      evidence: "Checklist, consulta e registro de aprovação",
      finalChecklist: ["Dados validados", "Duplicidade verificada", "Aprovação registrada", "Solicitante comunicado"],
    },
    questions: quizQuestions.map((question, index) => ({ ...question, id: `${process.id}-q${index + 1}`, options: [...question.options] })),
    updatedAt: new Date().toISOString(),
  };
}

export const initialLearningContent = Object.fromEntries(
  academyProcesses.map((process) => [process.id, createDefaultLearningContent(process)]),
) as Record<string, ProcessLearningContent>;
