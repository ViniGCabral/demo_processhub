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

// Map of all SOPs by ID
export const sopDataMap: Record<string, SOPData> = {
  "1": sopS2P35,
  "2": sopH2R121,
  "7": sopIT01,
  "span-layer": sopSpanLayer,
};

// Default SOP for demo mode - IT Prepaid
export const sopDemoDefault = sopIT01;

// Default export for backward compatibility
export const sopMockData = sopS2P35;
