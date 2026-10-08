// SOP Mock Data - Multiple processes with hierarchical structure

export type SOPAutomationClass = "ME" | "MS" | "MA" | "SA" | "AU" | "MNA";

export interface SOPSubstep {
  id: string;
  description: string;
  image?: string;
  isConditional?: boolean;
  conditionalText?: string;
  children?: SOPSubstep[]; // Nested substeps
}

export interface SOPStep {
  id: string;
  title: string;
  description?: string;
  image?: string;
  substeps?: SOPSubstep[];
  /** Micro-level attributes */
  executor?: string;
  system?: string;
  automationClass?: SOPAutomationClass;
  executionTime?: string;
  /** Optional: average waiting time for validations / external contact */
  waitTime?: string;
  hasWaitTime?: boolean;
  /** Flags system customizations that must be tracked for this step. */
  hasSystemCustomization?: boolean;
  customizationSystem?: string;
  customizationDescription?: string;
  customizationOwner?: string;
  customizationStatus?: "identified" | "monitoring" | "validated";
}

export interface SOPInputOutput {
  inputs: {
    description: string;
    source: string;
  }[];
  outputs: {
    description: string;
    source: string;
  }[];
}

export type SOPProcessClassification = "core" | "support" | "management";

export interface SOPMetadata {
  objective: string;
  soxControls?: string;
  sla?: string;
  frequency?: string;
  estimatedTime?: string;
  /** How many times the process runs within the defined frequency (e.g. "3x ao mês") */
  volumetry?: string;
  /** Core / Support / Management */
  classification?: SOPProcessClassification;
  /** KPIs tracked alongside this process */
  kpis?: string;
  raci?: {
    responsible: string;
    approver: string;
    consulted?: string;
    informed?: string;
  };
  systems?: string[];
  inputsOutputs?: SOPInputOutput;
}


export interface SOPData {
  id: string;
  title: string;
  code: string;
  area: string;
  /** Editable process identifier shown next to the title */
  processId?: string;
  objective: string;
  metadata?: SOPMetadata;
  steps: SOPStep[];
}


// S2P - Cotação de Frete Emergencial
export const sopS2P35: SOPData = {
  id: "1",
  title: "Cotação de Frete Emergencial",
  code: "S2P 35",
  area: "S2P - Gestão de Frete",
  objective: "Realizar a cotação e aprovação de frete emergencial no sistema Mosaic, garantindo a seleção da modalidade mais econômica e o preenchimento correto dos dados.",
  metadata: {
    objective: "Realizar a cotação e aprovação de frete emergencial no sistema Mosaic, garantindo a seleção da modalidade mais econômica e o preenchimento correto dos dados.",
    soxControls: "Pagamentos e contratações de frete emergencial requerem aprovação gerencial via sistema antes do prosseguimento. Obrigatório o registro comparativo entre custo emergencial e Standard para auditoria.",
    sla: "Para fretes emergenciais, a execução deve ocorrer imediatamente após a realização do chamado.",
    frequency: "Sob demanda",
    estimatedTime: "10-15 minutos",
    raci: {
      responsible: "Analista de suprimentos",
      approver: "Gerente da área solicitante"
    },
    systems: ["ServiceNow", "Calculadora de fretes (Excel)", "Google Maps"],
    inputsOutputs: {
      inputs: [
        { description: "Chamado no ServiceNow com informações necessárias", source: "ServiceNow, Google Maps" }
      ],
      outputs: [
        { description: "Valor do frete calculado", source: "Excel" },
        { description: "Registro na base de controle de fretes", source: "Excel" }
      ]
    }
  },
  steps: [
    {
      id: "1",
      title: "Análise Inicial e Configuração do Chamado",
      substeps: [
        {
          id: "1.1",
          description: "Acessar o sistema ServiceNow através do portal interno da empresa."
        },
        {
          id: "1.2",
          description: "Localizar o chamado correspondente (ex: GFRT0007807) e clicar em 'Iniciar a execução'.",
          image: "/images/sop/step-1.png"
        },
        {
          id: "1.3",
          description: "Analisar os dados do chamado: verificar se todas as informações necessárias estão preenchidas (origem, destino, tipo de carga, urgência)."
        },
        {
          id: "1.4",
          description: "No campo de descrição, verificar as especificações do frete emergencial:\n• Tipo: FRETE EMERGENCIAL\n• Data de Coleta\n• Data de Entrega\n• Origem e Destino",
          image: "/images/sop/step-2.png"
        },
        {
          id: "1.5",
          description: "Atualize os campos obrigatórios caso estejam incompletos. Confirme que o status está como 'Aberto' para prosseguir."
        },
        {
          id: "1.6",
          description: "No campo E-mail, inserir os endereços de e-mail de todas as transportadoras que devem receber a solicitação de cotação. Separar os e-mails por vírgula.",
          image: "/images/sop/step-3.png"
        }
      ]
    },
    {
      id: "2",
      title: "Cálculo do Frete",
      hasSystemCustomization: true,
      customizationSystem: "Calculadora de fretes (Excel)",
      customizationDescription: "Planilha com regras e fórmulas customizadas para cálculo e comparação das modalidades de frete.",
      customizationOwner: "Operações de Logística",
      customizationStatus: "monitoring",
      substeps: [
        {
          id: "2.1",
          description: "Acessar a ferramenta 'Simulador de Frete Fracionado' através do menu de ferramentas."
        },
        {
          id: "2.2",
          description: "Inserir a cidade de origem e destino (cidade/UF) nos campos correspondentes.",
          image: "/images/sop/step-4.png"
        },
        {
          id: "2.3",
          description: "Preencher os campos adicionais:\n• Pedágio (Sim/Não)\n• Valor Total do Material\n• Peso Nota Fiscal (kg)\n• Incoterms\n• Número do Chamado\n• Data do Chamado"
        },
        {
          id: "2.4",
          description: "Se a distância entre origem e destino for superior a 500km, utilizar a calculadora de frete lotação.",
          isConditional: true,
          conditionalText: "Se distância > 500km"
        },
        {
          id: "2.5",
          description: "Aguardar o cálculo automático do sistema e verificar se as informações estão corretas, incluindo a observação sobre isenção de ICMS quando aplicável.",
          image: "/images/sop/step-5.png"
        }
      ]
    },
    {
      id: "3",
      title: "Comparação e Seleção de Modalidade",
      substeps: [
        {
          id: "3.1",
          description: "Analisar o comparativo de fretes exibido pelo sistema entre as modalidades disponíveis.",
          image: "/images/sop/step-6.png"
        },
        {
          id: "3.2",
          description: "Avaliar cada modalidade:\n• Fracionado: menor custo para cargas pequenas\n• Lotação: custo intermediário\n• Emergencial: maior custo, usar apenas quando necessário"
        },
        {
          id: "3.3",
          description: "Selecionar a modalidade mais econômica que atenda ao prazo solicitado pelo cliente."
        },
        {
          id: "3.4",
          description: "Se nenhuma modalidade atender ao prazo, escalar para o gerente da área para aprovação do frete emergencial premium.",
          isConditional: true,
          conditionalText: "Se prazo não atendido"
        }
      ]
    },
    {
      id: "4",
      title: "Registro e Finalização",
      hasSystemCustomization: true,
      customizationSystem: "ServiceNow",
      customizationDescription: "Campos e fluxo de status configurados especificamente para o atendimento de fretes emergenciais.",
      customizationOwner: "TI Corporativa",
      customizationStatus: "validated",
      substeps: [
        {
          id: "4.1",
          description: "Retornar à aba 'Frete Final' no chamado original."
        },
        {
          id: "4.2",
          description: "Preencher o campo 'Valor do frete final' com o valor negociado da transportadora selecionada.",
          image: "/images/sop/step-7.png"
        },
        {
          id: "4.3",
          description: "Registrar na base de controle de fretes (Excel) o comparativo entre custo emergencial e custo Standard para fins de auditoria."
        },
        {
          id: "4.4",
          description: "Salvar o chamado e atualizar o status para 'Em andamento' ou 'Concluído' conforme o caso."
        }
      ]
    }
  ]
};

// H2R - Adjust EHS Learning Schedules
export const sopH2R121: SOPData = {
  id: "2",
  title: "Adjust EHS Learning Schedules",
  code: "H2R 121",
  area: "H2R - LMS",
  objective: "To adjust the expiration dates of EHS (Environment, Health, Safety) learning schedules within the Workday Learning system. This process is initiated upon request from the EHS Training team and involves two main stages: modifying the course's default expiration rule and then resetting the expiration date on all relevant employee learning records.",
  metadata: {
    objective: "To adjust the expiration dates of EHS (Environment, Health, Safety) learning schedules within the Workday Learning system.",
    soxControls: "All EHS training modifications must be documented and approved by the EHS Training Manager before execution.",
    sla: "Expiration date adjustments must be completed within 2 business days of receiving the request.",
    frequency: "Upon request",
    estimatedTime: "15-20 minutes",
    raci: {
      responsible: "Learning Administrator",
      approver: "EHS Training Manager"
    },
    systems: ["Workday Learning"],
    inputsOutputs: {
      inputs: [
        { description: "Request from EHS Training team with new expiration date", source: "Email/ServiceNow" }
      ],
      outputs: [
        { description: "Updated course expiration rules", source: "Workday Learning" },
        { description: "Reset employee learning records", source: "Workday Learning" }
      ]
    }
  },
  steps: [
    {
      id: "1",
      title: "Access and Locate Course",
      substeps: [
        {
          id: "1.1",
          description: "Access Workday Learning system through the company portal."
        },
        {
          id: "1.2",
          description: "In the main search bar, type \"LRN:\" followed by the course title (e.g., \"LRN Bloodborne Pathogens\") to filter for learning-related content.",
          image: "/images/sop-h2r/step-1.jpg"
        },
        {
          id: "1.3",
          description: "Select the correct course from the search results."
        }
      ]
    },
    {
      id: "2",
      title: "Edit Course Expiration Settings",
      substeps: [
        {
          id: "2.1",
          description: "On the course page, click \"Edit\".",
          image: "/images/sop-h2r/step-2.jpg"
        },
        {
          id: "2.2",
          description: "A pop-up will ask to confirm the version. Click \"OK\" to edit the current version."
        },
        {
          id: "2.3",
          description: "Scroll down to the \"Expiration Rule Set\" section."
        },
        {
          id: "2.4",
          description: "In the \"Current Expiration Date\" field, enter the new date requested by the EHS team.",
          image: "/images/sop-h2r/step-3.jpg"
        },
        {
          id: "2.5",
          description: "If using Advanced Learning Expiration Rules by location/group, set the default to \"Select one\" and configure each group separately.",
          isConditional: true,
          conditionalText: "If using Advanced Rules"
        }
      ]
    },
    {
      id: "3",
      title: "Submit Changes",
      substeps: [
        {
          id: "3.1",
          description: "Click \"Submit\" to save changes.",
          image: "/images/sop-h2r/step-4.jpg"
        },
        {
          id: "3.2",
          description: "An alert will appear: \"If you've updated default or advanced expiration rules, any completed learning records for these rules will also be updated.\""
        },
        {
          id: "3.3",
          description: "Click \"Submit\" again to confirm."
        }
      ]
    },
    {
      id: "4",
      title: "Reset Expiration Date on Learning Records",
      substeps: [
        {
          id: "4.1",
          description: "In the main Workday search bar, type \"Reset expiration date on learning records\" and select the task.",
          image: "/images/sop-h2r/step-5.jpg"
        },
        {
          id: "4.2",
          description: "In the \"Learning Content\" field, search for and select the same course you just edited."
        },
        {
          id: "4.3",
          description: "Leave all other fields blank to load all records for this course."
        },
        {
          id: "4.4",
          description: "Filter the \"Expiration Date\" column to find users who need to be moved to the new date."
        },
        {
          id: "4.5",
          description: "Select the affected records and submit the reset."
        }
      ]
    }
  ]
};

// IT Prepaid Amortization Process
export const sopIT01: SOPData = {
  id: "7",
  title: "IT Prepaid Amortization Process",
  code: "IT 01",
  area: "IT - EBS",
  objective: "To establish the procedure for identifying, validating, and coding IT prepaid expenses received from the Record to Report (R2R) team for accurate amortization entries in Blackline.",
  metadata: {
    objective: "To establish the procedure for identifying, validating, and coding IT prepaid expenses received from the Record to Report (R2R) team for accurate amortization entries in Blackline.",
    soxControls: "Management Review & Approval: All accounting classification data must be reviewed and approved by VMO Leadership before submission to the R2R team.",
    sla: "The validation and return of the data file to the EBS team should ideally occur within 2 business days of receipt.",
    frequency: "Monthly",
    estimatedTime: "15 to 30 minutes for data validation, plus variable time for leadership review",
    raci: {
      responsible: "IT Financial Management Associate",
      approver: "VMO Leadership",
      consulted: "R2R Team",
      informed: "N/A"
    },
    systems: ["Microsoft Excel", "Microsoft Outlook"],
    inputsOutputs: {
      inputs: [
        { description: "Excel file listing transactions/invoices exceeding $100,000 threshold", source: "Email from R2R Team" },
        { description: "S4 IT Purchase Orders [Year] spreadsheet with all PO details", source: "VMO Team SharePoint" }
      ],
      outputs: [
        { description: "Populated Excel file with validated Cost Center, GL Account, and Profit Center", source: "Microsoft Excel" },
        { description: "Email confirmation to R2R to proceed with Blackline entry", source: "Microsoft Outlook" }
      ]
    }
  },
  steps: [
    {
      id: "1",
      title: "Receive Amortization Request and Open PO Spreadsheet",
      description: "Initial receipt of the amortization request and preparation of reference materials",
      substeps: [
        { 
          id: "1.1", 
          description: "Receive an email from the EBS Team containing a file of invoices posted in SAP that exceed the $100,000 threshold.", 
          image: "/images/sop-it-prepaid/step-1.jpg" 
        },
        { 
          id: "1.2", 
          description: "Open the 'S4 IT Purchase Orders [Year]' file. This is the manual entry master file managed by the VMO team containing all PO details.", 
          image: "/images/sop-it-prepaid/step-2.jpg" 
        }
      ]
    },
    {
      id: "2",
      title: "Validate Accounting Strings",
      description: "Verification and validation of accounting codes from the PO master file",
      substeps: [
        { 
          id: "2.1", 
          description: "Open the spreadsheet received from the R2R team.", 
          image: "/images/sop-it-prepaid/step-3.jpg" 
        },
        { 
          id: "2.2", 
          description: "In the 'S4 IT Purchase Orders [Year]' file, locate the specific Purchase Order (PO) related to the invoice.", 
          image: "/images/sop-it-prepaid/step-4.jpg" 
        },
        { 
          id: "2.3", 
          description: "Verify the allocation codes:\n• The 8 digits in the middle represent the Cost Center (e.g., 10007280)\n• The 6 digits on the right represent the GL Account (e.g., 500103)", 
          image: "/images/sop-it-prepaid/step-5.jpg" 
        }
      ]
    },
    {
      id: "3",
      title: "Populate Invoices File",
      description: "Data entry of validated accounting strings into the R2R file",
      substeps: [
        { 
          id: "3.1", 
          description: "In the file received from R2R, populate the required columns based on 'S4 IT Purchase Orders [Year]' spreadsheet:\n• Column I: GL Account\n• Column J: Cost Center (or WBS if applicable)\n• Column K: Profit Center (10009004)\n\nNote: Ensure distinction between Cost Center and WBS Element; they are interchangeable but mutually exclusive for settlement.", 
          image: "/images/sop-it-prepaid/step-6.jpg" 
        }
      ]
    },
    {
      id: "4",
      title: "Partial Invoice Check",
      description: "Verification of invoice amounts against total PO values",
      substeps: [
        { 
          id: "4.1", 
          description: "Review the invoice amount against the total PO value. Be aware that suppliers may post partial invoices (e.g., $200k invoice on a $400k PO).", 
          isConditional: true, 
          conditionalText: "If partial invoice detected" 
        },
        { 
          id: "4.2", 
          description: "Ensure the R2R team is aware if the invoice represents only a portion of the total amortization required for the PO." 
        }
      ]
    },
    {
      id: "5",
      title: "Review and Final Submission",
      description: "Leadership approval and final submission to R2R team",
      substeps: [
        { 
          id: "5.1", 
          description: "Email the completed file to VMO Leadership for review and await confirmation/alignment from all leadership members.", 
          image: "/images/sop-it-prepaid/step-7.jpg" 
        },
        { 
          id: "5.2", 
          description: "Once approved, reply to the R2R Team attaching the finalized file with the coding data.", 
          image: "/images/sop-it-prepaid/step-8.jpg" 
        },
        { 
          id: "5.3", 
          description: "The R2R team will then create the prepaid amortization in Blackline." 
        }
      ]
    }
  ]
};

// Span & Layer (demo for "Span & Layer" process)
export const sopSpanLayer: SOPData = {
  id: "span-layer",
  title: "Span & Layer",
  code: "SOP HR-SL-01",
  area: "People Analytics",
  processId: "PRC-HR-0142",
  objective: "Mapear e analisar a estrutura organizacional da Natura com base em Span of Control e Layer, gerando insights para decisões de design, dimensionamento e eficiência da gestão.",
  metadata: {
    objective: "Mapear e analisar a estrutura organizacional da Natura com base em Span of Control e Layer, gerando insights para decisões de design, dimensionamento e eficiência da gestão.",
    soxControls: "NDA e confidencialidade de dados; LGPD - proteção de dados pessoais.",
    sla: "Envio das bases solicitadas em até 7 dias; confirmação de recebimento em 48 horas.",
    frequency: "Trimestral; Ad Hoc (limpeza de base)",
    volumetry: "4 execuções por ano (1 por trimestre) + ~2 execuções ad hoc",
    classification: "management",
    kpis: "Span of Control médio; Nº de Layers da estrutura; % de gestores com span < 3; Custo de estrutura por banda",
    estimatedTime: "2–8 horas por ciclo para extração e tratamento; 1–2 horas para exportar e carregar relatórios.",

    raci: {
      responsible: "Analista de People (Sofia); Equipe de People Analytics",
      approver: "Líder de People Analytics; Head de People",
      consulted: "—",
      informed: "—",
    },
    systems: ["Workday", "Excel", "Google Sheets / Google Drive"],
    inputsOutputs: {
      inputs: [
        { description: "Open File Positions (export Workday)", source: "Workday" },
        { description: "Supervisor Organization (solid line) (export Workday)", source: "Time de Finanças" },
        { description: "Spanning Layers raw export (Workday)", source: "Business Partners / gestores" },
        { description: "Custos por banda / custos reais (Finanças)", source: "Finanças" },
      ],
      outputs: [
        { description: "Base limpa Span & Layer", source: "Google Drive / Sheets (pasta compartilhada)" },
        { description: "Tabelas dinâmicas e gráficos", source: "Slides / apresentações entregues" },
        { description: "Apresentação consolidada para reuniões", source: "—" },
      ],
    },
  },
  steps: [
    {
      id: "1",
      title: "Preparação e extração de dados no Workday",
      executor: "Analista de People Analytics",
      system: "Workday",
      automationClass: "MS",
      executionTime: "45 min",
      hasWaitTime: true,
      waitTime: "48h (retorno do time de Finanças com bases de custo)",
      substeps: [
        {
          id: "1.1",
          description: "Extrair o relatório 'Open and Filled Positions Master' com filtros aplicados.",
          image: "/images/sop-span-layer/image1.jpg",
          children: [
            {
              id: "1.1.1",
              description: "Na barra de busca do Workday, digitar 'Open and Filled Positions Master' e abrir o relatório.",
              image: "/images/sop-span-layer/image2.png",
            },
            {
              id: "1.1.2",
              description: "Aplicar filtro de região para LATAM e limitar à visão Brasil.",
              image: "/images/sop-span-layer/image3.jpg",
            },
            {
              id: "1.1.3",
              description: "Incluir posições cobertas ou vagas até a data de corte definida.",
              image: "/images/sop-span-layer/image4.jpg",
            },
          ],
        },
        {
          id: "1.2",
          description: "Extrair o relatório 'Supervisory Organization (Solid Line)' para estrutura hierárquica.",
          image: "/images/sop-span-layer/image5.jpg",
        },
      ],
    },
    {
      id: "2",
      title: "Exportação e consolidação da base em Google Sheets",
      executor: "Analista de People Analytics",
      system: "Workday / Google Sheets",
      automationClass: "ME",
      executionTime: "30 min",
      substeps: [
        {
          id: "2.1",
          description: "Exportar relatórios e centralizar a base de trabalho em Google Sheets.",
          image: "/images/sop-span-layer/image6.jpg",
          children: [
            {
              id: "2.1.1",
              description: "Exportar cada relatório do Workday em formato Excel.",
              image: "/images/sop-span-layer/image7.jpg",
            },
            {
              id: "2.1.2",
              description: "Aguardar a conclusão do download dos arquivos (pode levar alguns minutos).",
              image: "/images/sop-span-layer/image8.png",
            },
            {
              id: "2.1.3",
              description: "Mover os arquivos para o Google Drive e abrir no Google Sheets para trabalhar diretamente.",
              image: "/images/sop-span-layer/image9.jpg",
            },
          ],
        },
      ],
    },
    {
      id: "3",
      title: "Cálculo de Layers (níveis hierárquicos)",
      executor: "Analista de People Analytics",
      system: "Google Sheets",
      automationClass: "MA",
      executionTime: "1h 30min",
      substeps: [
        {
          id: "3.1",
          description: "Derivar níveis da estrutura (layers) a partir do relatório de Supervisory Organization.",
          image: "/images/sop-span-layer/image10.jpg",
          children: [
            {
              id: "3.1.1",
              description: "Localizar o número/ID da organização supervisora no relatório.",
              image: "/images/sop-span-layer/image11.jpg",
            },
            {
              id: "3.1.2",
              description: "Quantificar os níveis até o último nível da estrutura hierárquica.",
              image: "/images/sop-span-layer/image12.jpg",
            },
          ],
        },
      ],
    },
    {
      id: "4",
      title: "Cálculo de Span (número de subordinados diretos por gestor)",
      executor: "Analista de People Analytics",
      system: "Google Sheets",
      automationClass: "MA",
      executionTime: "2h",
      hasWaitTime: true,
      waitTime: "5 dias úteis (validação dos gestores / Business Partners)",
      substeps: [
        {
          id: "4.1",
          description: "Calcular o span por gestor utilizando a contagem de reportes diretos.",
          image: "/images/sop-span-layer/image13.jpg",
          children: [
            {
              id: "4.1.1",
              description: "Contar quantas vezes o manager aparece no relatório para obter o número de liderados diretos.",
              image: "/images/sop-span-layer/image13.jpg",
            },
            {
              id: "4.1.2",
              description: "Aplicar o filtro de público administrativo conforme critério vigente.",
              image: "/images/sop-span-layer/image14.jpg",
            },
            {
              id: "4.1.3",
              description: "Calcular a média de span do público analisado.",
              image: "/images/sop-span-layer/image15.jpg",
            },
          ],
        },
      ],
    },
  ],
};

// Cadastro Conta Bancaria
export const sopCadastroContaBancaria: SOPData = {
  id: "proc-cadastro-conta-bancaria",
  title: "Cadastro de conta bancária",
  code: "FIN",
  area: "FIN",
  objective: "Cadastrar a instituição financeira como Banco da Empresa (House Bank), definir a conta corrente específica com seus dados de agência e moeda (Account ID) e vinculá-la a uma conta do razão contábil (G/L Account).",
  metadata: {
    objective: "Cadastrar a instituição financeira como Banco da Empresa (House Bank), definir a conta corrente específica com seus dados de agência e moeda (Account ID) e vinculá-la a uma conta do razão contábil (G/L Account).",
    sla: "2 dias",
    frequency: "Sob demanda",
    estimatedTime: "5 a 10 minutos",
    raci: {
      responsible: "Equipe de Cadastro (Operador SAP)",
      approver: "—",
      consulted: "Master Data",
      informed: "Master Data"
    },
    systems: ["SAP (Manage Banks)", "E-mail", "Google"],
    inputsOutputs: {
      inputs: [
        { description: "E-mail de solicitação contendo: código do banco (Bank Number), Bank Key, agência (Bank Branch), endereço do banco", source: "Master Data" },
        { description: "Anexos de e-mail (prints/extrato/cheque)", source: "Master Data" },
        { description: "Pesquisa pública (Google) para confirmar código/nome do banco", source: "Google" }
      ],
      outputs: [
        { description: "E-mail de resposta com print da tela SAP indicando banco já cadastrado", source: "SAP" },
        { description: "E-mail de confirmação informando que o banco foi criado", source: "SAP" }
      ]
    }
  },
  steps: [
    {
      id: "1",
      title: "Receber e conferir a solicitação de cadastro de banco enviada pela área de Master Data",
      substeps: [
        { id: "1.1", description: "Receber por e-mail a solicitação de inclusão dos dados bancários enviada pela área de Master Data, que precisa desses dados para pagamento", image: "/images/sop-cadastro/image1.jpg" },
        { id: "1.2", description: "Conferir no e-mail recebido as informações necessárias para o cadastro do banco", image: "/images/sop-cadastro/image2.jpg" },
        { id: "1.2.1", description: "Verificar se o e-mail traz o print do comprovante (cheque ou extrato); o anexo não é obrigatório, mas apoia a conferência das informações", image: "/images/sop-cadastro/image3.jpg" },
        { id: "1.2.2", description: "Conferir se o e-mail contém banco, código do banco, agência e endereço do banco, que são a entrada obrigatória do processo", image: "/images/sop-cadastro/image4.jpg" }
      ]
    },
    {
      id: "2",
      title: "Consultar no SAP se o Bank Key solicitado já está cadastrado",
      substeps: [
        { id: "2.1", description: "Abrir no SAP a transação Manage Banks", image: "/images/sop-cadastro/image5.jpg" },
        { id: "2.1.1", description: "Pesquisar no SAP a transação \"Manage Banks\" (nome consultado na cola de transações utilizada pelo executor)" },
        { id: "2.1.2", description: "Confirmar que o sistema abriu a tela da transação Manage Banks", image: "/images/sop-cadastro/image6.jpg" },
        { id: "2.2", description: "Pesquisar na transação Manage Banks o Bank Key informado na solicitação", image: "/images/sop-cadastro/image7.jpg" },
        { id: "2.2.1", description: "Copiar o Bank Key informado no e-mail da área de Master Data" },
        { id: "2.2.2", description: "Colar o valor no campo Bank Key e acionar \"Go\" para executar a pesquisa", image: "/images/sop-cadastro/image7.jpg" },
        { id: "2.3", description: "Avaliar o resultado retornado pela pesquisa do Bank Key", image: "/images/sop-cadastro/image8.jpg" },
        { 
          id: "2.3.1", 
          description: "A pesquisa na transação Manage Banks mostra que o Bank Key solicitado já existe no SAP. Gerar o print da tela do SAP com as informações do Bank Key já cadastrado e responder o e-mail da área de Master Data informando que o banco já está cadastrado, anexando o print e informando a quantidade de usuários que já utilizam essa conta.", 
          isConditional: true, 
          conditionalText: "Se o Bank Key já está cadastrado",
          image: "/images/sop-cadastro/image9.jpg"
        },
        { 
          id: "2.3.2", 
          description: "Criar o cadastro do novo banco na transação Manage Banks.", 
          isConditional: true, 
          conditionalText: "Se o Bank Key não for localizado"
        }
      ]
    },
    {
      id: "3",
      title: "Criar o cadastro do novo banco na transação Manage Banks",
      substeps: [
        { id: "3.1", description: "Acionar a opção \"Create\" na transação Manage Banks para abrir os campos de cadastro", image: "/images/sop-cadastro/image10.jpg" },
        { id: "3.1.1", description: "Clicar na opção \"Create\" da tela Manage Banks", image: "/images/sop-cadastro/image11.jpg" },
        { id: "3.1.2", description: "Confirmar que o sistema abriu as opções/campos de preenchimento do cadastro", image: "/images/sop-cadastro/image12.jpg" },
        { id: "3.2", description: "Preencher os campos do cadastro conforme os dados solicitados pela área de Master Data", image: "/images/sop-cadastro/image13.jpg" },
        { id: "3.2.1", description: "Preencher os campos abertos conforme as informações enviadas na solicitação da área de Master Data" },
        { id: "3.2.2", description: "Abrir o campo Bank Country em \"mais informações\" e selecionar o país Brasil" },
        { id: "3.2.3", description: "Informar o código do país (BR), dar dois cliques no campo e confirmar que o sistema preenche automaticamente conforme o padrão", image: "/images/sop-cadastro/image14.jpg" }
      ]
    },
    {
      id: "4",
      title: "Iniciar a criação do cadastro de banco no SAP quando o banco não existe",
      substeps: [
        { id: "4.1", description: "Confirmar que nenhum banco foi localizado na consulta anterior antes de criar um novo cadastro" },
        { id: "4.2", description: "Acessar a opção \"Create\" e abrir a tela de preenchimento dos dados do banco", image: "/images/sop-cadastro/image15.jpg" },
        { id: "4.2.1", description: "Clicar na parte \"Create\" da tela para iniciar o novo cadastro de banco" },
        { id: "4.2.2", description: "Conferir que o sistema abriu os campos de cadastro e preenchê-los conforme os dados solicitados pela área solicitante" }
      ]
    },
    {
      id: "5",
      title: "Preencher os dados de identificação do banco (país, chave, nome e agência)",
      substeps: [
        { id: "5.1", description: "Preencher o campo \"Bank Country\" com o país do banco" },
        { id: "5.1.1", description: "Clicar no campo \"Bank Country\" para abrir as informações adicionais de seleção de país", image: "/images/sop-cadastro/image16.jpg" },
        { id: "5.1.2", description: "Selecionar \"Brasil\" como país do banco, pois as solicitações recebidas são apenas para o Brasil (as demais localidades fazem o próprio cadastro)" },
        { id: "5.2", description: "Preencher o campo \"Bank Key\" conforme os dados enviados na solicitação", image: "/images/sop-cadastro/image17.jpg" },
        { id: "5.2.1", description: "Dar dois cliques no campo \"Bank Key\" e conferir que o sistema preenche automaticamente conforme o padrão do SAP" },
        { id: "5.2.2", description: "Informar no \"Bank Key\" o valor indicado pela área solicitante na solicitação" },
        { id: "5.2.3", description: "Conferir a composição do \"Bank Key\": início com o número do banco (ex.: 033 para o Santander) e final com a agência", image: "/images/sop-cadastro/image18.jpg" },
        { id: "5.3", description: "Preencher o campo \"Bank Name\" com o nome real (razão social) do banco" },
        { id: "5.3.1", description: "Pesquisar o nome real do banco, pois não se usa apenas o nome comercial (ex.: não usar somente \"Santander\")", image: "/images/sop-cadastro/image19.jpg" },
        { id: "5.3.2", description: "Fazer a pesquisa no Google e localizar a razão social do banco (ex.: \"Banco Santander SA\")", image: "/images/sop-cadastro/image20.jpg" },
        { id: "5.3.3", description: "Quando a área solicitante enviar print/suporte, adotar o nome exatamente conforme o documento enviado (ex.: cooperativa de crédito)", image: "/images/sop-cadastro/image21.jpg" },
        { id: "5.3.4", description: "Digitar o nome do banco encontrado no campo \"Bank Name\"" },
        { id: "5.4", description: "Tratar os campos \"Swift\" e \"Bank Branch\"", image: "/images/sop-cadastro/image22.jpg" },
        { id: "5.4.1", description: "Deixar o campo \"Swift\" sem preenchimento, pois ele é usado apenas para transferências para bancos no exterior", image: "/images/sop-cadastro/image22.jpg" },
        { id: "5.4.2", description: "Preencher o campo \"Bank Branch\", que é o campo utilizado neste cadastro" }
      ]
    },
    {
      id: "6",
      title: "Preencher a classificação e o código do banco e deixar em branco os campos não obrigatórios",
      substeps: [
        { id: "6.1", description: "Preencher o campo \"Bank Category\" sempre com \"Standard Bank\", sem exceção", image: "/images/sop-cadastro/image23.jpg" },
        { id: "6.2", description: "Deixar o campo \"Bank Group\" sem preenchimento, pois não é necessário", image: "/images/sop-cadastro/image24.jpg" },
        { id: "6.3", description: "Preencher o campo \"Bank Number\" com o código do banco", image: "/images/sop-cadastro/image25.jpg" },
        { id: "6.3.1", description: "Pesquisar o código do banco no Google e identificar o número retornado (ex.: Banco Santander = 33)", image: "/images/sop-cadastro/image26.jpg" },
        { id: "6.3.2", description: "Informar o código no campo \"Bank Number\" (ex.: 033)", image: "/images/sop-cadastro/image27.jpg" },
        { id: "6.3.3", description: "Conferir que o código foi informado com 3 dígitos, completando com zero quando necessário (ex.: Santander 033; Cresol 133)", image: "/images/sop-cadastro/image25.jpg" },
        { id: "6.4", description: "Deixar sem preenchimento os campos seguintes que não são necessários", image: "/images/sop-cadastro/image28.jpg" },
        { id: "6.4.1", description: "Não preencher o campo seguinte ao \"Bank Number\", indicado como não necessário durante a demonstração" },
        { id: "6.4.2", description: "Não preencher o campo \"Intraday\"" }
      ]
    },
    {
      id: "7",
      title: "Tratar o endereço do banco no campo de região",
      substeps: [
        { id: "7.1", description: "Verificar se a área solicitante informou o endereço do banco", image: "/images/sop-cadastro/image29.jpg" },
        { 
          id: "7.1.1", 
          description: "Preencher o campo de região com o endereço do banco informado pela área solicitante.", 
          isConditional: true, 
          conditionalText: "Se o endereço foi informado"
        },
        { 
          id: "7.1.2", 
          description: "Deixar o campo de endereço sem preenchimento, pois a informação não é obrigatória para o cadastro. Registrar a informação \"banco cadastrado sem informações de endereço\" no retorno à área solicitante.", 
          isConditional: true, 
          conditionalText: "Se o endereço NÃO foi informado"
        },
        { id: "7.2", description: "Preencher o campo de região com o endereço do banco informado pela área solicitante" }
      ]
    },
    {
      id: "8",
      title: "Cadastrar o banco no SAP com os dados informados na solicitação",
      substeps: [
        { id: "8.1", description: "Verificar na solicitação se o endereço do banco foi informado", image: "/images/sop-cadastro/image30.jpg" },
        { 
          id: "8.1.1", 
          description: "Preencher os campos de endereço do banco no SAP com os dados informados.", 
          isConditional: true, 
          conditionalText: "Se o endereço foi informado"
        },
        { 
          id: "8.1.2", 
          description: "Seguir com o cadastro sem preencher os campos de endereço, que permanecem em branco no cadastro e no print. Registrar na resposta à solicitante a observação de que o banco foi cadastrado/criado sem informação de endereço.", 
          isConditional: true, 
          conditionalText: "Se o endereço NÃO foi informado"
        },
        { id: "8.2", description: "Preencher os campos de endereço do banco no SAP com os dados informados", image: "/images/sop-cadastro/image31.jpg" },
        { id: "8.2.1", description: "Acessar o campo de informações adicionais e informar a cidade do banco (ex.: São Paulo), mantendo o mesmo padrão de preenchimento já utilizado", image: "/images/sop-cadastro/image32.jpg" },
        { id: "8.2.2", description: "Informar o estado do banco no campo Região (ex.: São Paulo)", image: "/images/sop-cadastro/image33.jpg" },
        { id: "8.2.3", description: "Preencher os demais campos de endereço com rua ou avenida, número e bairro (ex.: Avenida 925 Higienópolis)", image: "/images/sop-cadastro/image34.jpg" },
        { id: "8.3", description: "Preencher os dados bancários do cadastro no SAP", image: "/images/sop-cadastro/image35.jpg" },
        { id: "8.3.1", description: "Informar no campo Bank Branch o número da agência enviado na solicitação (ex.: agência 1893)" },
        { id: "8.3.2", description: "Informar no campo Bank Number o código do banco (ex.: Banco do Brasil 001, Santander 33)", image: "/images/sop-cadastro/image36.jpg" },
        { id: "8.3.3", description: "Informar no campo Bank Key o código do banco somado ao número da conta que será utilizada nos pagamentos", image: "/images/sop-cadastro/image37.jpg" },
        { id: "8.4", description: "Salvar o cadastro do banco e confirmar o resultado apresentado pelo SAP" },
        { id: "8.4.1", description: "Concluído todo o preenchimento, salvar o cadastro do banco no SAP", image: "/images/sop-cadastro/image38.jpg" },
        { 
          id: "8.4.2", 
          description: "Verificar se o SAP exibe alerta impedindo o salvamento por já existir cadastro desse banco. Não concluir novo cadastro para o banco; Responder à solicitante que o banco já possui cadastro.", 
          isConditional: true, 
          conditionalText: "Se o SAP exibe alerta de banco já existente",
          image: "/images/sop-cadastro/image39.jpg"
        },
        { id: "8.4.3", description: "Com o salvamento bem-sucedido, conferir a tela apresentada pelo sistema com as informações do banco cadastrado", image: "/images/sop-cadastro/image40.jpg" }
      ]
    },
    {
      id: "9",
      title: "Responder a solicitante com a evidência do cadastro realizado",
      substeps: [
        { id: "9.1", description: "Capturar o print da tela final do cadastro no SAP", image: "/images/sop-cadastro/image41.jpg" },
        { id: "9.2", description: "Responder o e-mail da solicitante anexando o print e as informações do banco cadastrado" }
      ]
    }
  ]
};


// Map of all SOPs by ID
export const sopDataMap: Record<string, SOPData> = {
  "proc-cadastro-conta-bancaria": sopCadastroContaBancaria,
  "1": sopS2P35,
  "2": sopH2R121,
  "7": sopIT01,
  "span-layer": sopSpanLayer,
};

// Default SOP for demo mode - IT Prepaid
export const sopDemoDefault = sopIT01;

// Default export for backward compatibility
export const sopMockData = sopS2P35;
