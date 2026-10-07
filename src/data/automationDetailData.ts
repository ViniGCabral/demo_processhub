import { ProcessAutomationDetailData } from "@/types/automationDetailTypes";

export const specialHandlingAutomationData: ProcessAutomationDetailData = {
  processId: "special-handling",
  processName: "Secondary Invoice Processing (P66)",
  sopCode: "P66_L6DTP",
  sopTitle: "Secondary Invoices and Rebill",
  summaryText: "Evaluation dataset for Secondary Invoice Processing and Credit/Debit Rebill. End-to-end evaluation with 31 main operational steps extracted from the SOP.",
  volumetrySummary: "31 main activities identified in the SOP, encompassing intake, SAP GUI routines, VIM, and manual approvals.",
  macroBlocks: [
    {
      id: "intake",
      order: 1,
      name: "Intake",
      description: "receive, collect, extract, and prepare data/documents",
      objective: "receive, collect, extract, and prepare data/documents",
      stepCount: 3,
      contextCards: [
        "Received invoice",
        "Support documents and attachments",
        "Nomination Key",
      ],
    },
    {
      id: "routing",
      order: 2,
      name: "Routing",
      description: "classify, prioritize, and route to the queue or responsible party",
      objective: "classify, prioritize, and route to the queue or responsible party",
      stepCount: 4,
      contextCards: [
        "Trip / Non-Trip → processing type",
        "Vendor / category → specific queue",
        "Company Code, GL, Profit Center → coding",
        "Scheduler / Gina → approval authority",
      ],
    },
    {
      id: "execution",
      order: 3,
      name: "Execution",
      description: "query, update, create, reconcile, or execute transactions",
      objective: "query, update, create, reconcile, or execute transactions",
      stepCount: 20,
      contextCards: [
        "Validate, reconcile, and process invoices",
        "Create or update VBDs and financial documents",
        "Execute entries in corporate systems",
      ],
    },
    {
      id: "exception",
      order: 4,
      name: "Exception",
      description: "handle discrepancies, missing data, ambiguities, blocks, and approvals",
      objective: "handle discrepancies, missing data, ambiguities, blocks, and approvals",
      stepCount: 3,
      contextCards: [
        "Missing document → Analyst / Scheduler",
        "Incorrect material → MDG",
        "Financial discrepancy → Supervisor / Accounting",
        "Revised invoice → Credit correction",
      ],
    },
    {
      id: "codification",
      order: 5,
      name: "Codification",
      description: "preserve evidence, record results, and prepare audit trail",
      objective: "preserve evidence, record results, and prepare audit trail",
      stepCount: 1,
      contextCards: [
        "Invoice processed and posted",
        "VBD created or updated",
        "Credit Memo / Debit Memo issued",
        "Intercompany report and audit trail",
      ],
    },
  ],
  solutions: [
  ],
  steps: [
    {
      id: "step_01",
      sourceStep: "1",
      number: "01",
      title: "Invoice receipt and manual upload via OAWD",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_01_1.1",
          sourceRef: "1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_01_1.2",
          sourceRef: "1.2",
          description: "Open the SAP client. Execute the OAWD transaction to enter the VIM workflow Invoice Upload screen.",
          classification: "ME"
        },
        {
          id: "step_01_1.3",
          sourceRef: "1.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_01_1.4",
          sourceRef: "1.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_01_1.4.1",
          sourceRef: "1.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_01_1.5",
          sourceRef: "1.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_02",
      sourceStep: "2",
      number: "02",
      title: "VIM Workplace Navigation and Use (S/4 VIM) — Access, Visualization and Basic Actions",
      description: "Operational procedure to access VIM Workplace, view index information and images, review and act on invoices (viewing, comments, simulation, reassignment, etc).",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_02_2.1",
          sourceRef: "2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.1.1",
          sourceRef: "2.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.2",
          sourceRef: "2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.2.1",
          sourceRef: "2.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.3",
          sourceRef: "2.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.3.1",
          sourceRef: "2.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.4",
          sourceRef: "2.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.4.1",
          sourceRef: "2.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.5",
          sourceRef: "2.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.5.1",
          sourceRef: "2.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.6",
          sourceRef: "2.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.1",
          sourceRef: "2.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_02_2.6.2",
          sourceRef: "2.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.6.3",
          sourceRef: "2.6.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.7",
          sourceRef: "2.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.7.1",
          sourceRef: "2.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.8",
          sourceRef: "2.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_02_2.8.1",
          sourceRef: "2.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_02_2.9",
          sourceRef: "2.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.9.1",
          sourceRef: "2.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.10",
          sourceRef: "2.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.10.1",
          sourceRef: "2.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_02_2.11",
          sourceRef: "2.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_02_2.12",
          sourceRef: "2.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.12.1",
          sourceRef: "2.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_02_2.13",
          sourceRef: "2.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_02_2.14",
          sourceRef: "2.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_02_2.14.1",
          sourceRef: "2.14.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_03",
      sourceStep: "3",
      number: "03",
      title: "Manual Non-PO invoice processing and VBD creation (Trip and Non-Trip) Executable procedure to register, code, submit for approval and",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_03_3.1",
          sourceRef: "3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.1.1",
          sourceRef: "3.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.2",
          sourceRef: "3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.1",
          sourceRef: "3.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.2",
          sourceRef: "3.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.3",
          sourceRef: "3.2.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.2.4",
          sourceRef: "3.2.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.3",
          sourceRef: "3.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.3.1",
          sourceRef: "3.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.3.2",
          sourceRef: "3.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.4",
          sourceRef: "3.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.4.1",
          sourceRef: "3.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.2",
          sourceRef: "3.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.4.3",
          sourceRef: "3.4.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.5",
          sourceRef: "3.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.6",
          sourceRef: "3.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.1",
          sourceRef: "3.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.6.2",
          sourceRef: "3.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.7",
          sourceRef: "3.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.7.1",
          sourceRef: "3.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.7.2",
          sourceRef: "3.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.8",
          sourceRef: "3.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.8.1",
          sourceRef: "3.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.8.2",
          sourceRef: "3.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.9",
          sourceRef: "3.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.1",
          sourceRef: "3.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.9.2",
          sourceRef: "3.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.10",
          sourceRef: "3.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.10.1",
          sourceRef: "3.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.10.2",
          sourceRef: "3.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.11",
          sourceRef: "3.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.11.1",
          sourceRef: "3.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.11.2",
          sourceRef: "3.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.11.3",
          sourceRef: "3.11.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.12",
          sourceRef: "3.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.12.1",
          sourceRef: "3.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.12.2",
          sourceRef: "3.12.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_03_3.12.3",
          sourceRef: "3.12.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.13",
          sourceRef: "3.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.13.1",
          sourceRef: "3.13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.13.2",
          sourceRef: "3.13.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.14",
          sourceRef: "3.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.1",
          sourceRef: "3.14.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.2",
          sourceRef: "3.14.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.14.3",
          sourceRef: "3.14.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.15",
          sourceRef: "3.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.1",
          sourceRef: "3.15.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_03_3.15.2",
          sourceRef: "3.15.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_03_3.15.3",
          sourceRef: "3.15.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_04",
      sourceStep: "4",
      number: "04",
      title: "Manual VBD creation (ZEWB) — fluxos Trip e Non‑Trip Executable procedure para criar VBD manualmente no Custom Trading Expenses Workbench para pro",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_04_4.1",
          sourceRef: "4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_04_4.2",
          sourceRef: "4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_04_4.3",
          sourceRef: "4.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.1",
          sourceRef: "4.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.2",
          sourceRef: "4.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_04_4.3.3",
          sourceRef: "4.3.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.4",
          sourceRef: "4.3.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.3.5",
          sourceRef: "4.3.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.4",
          sourceRef: "4.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.1",
          sourceRef: "4.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_04_4.4.2",
          sourceRef: "4.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.3",
          sourceRef: "4.4.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.4.4",
          sourceRef: "4.4.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_04_4.5",
          sourceRef: "4.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_04_4.6",
          sourceRef: "4.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_05",
      sourceStep: "5",
      number: "05",
      title: "Create MDG request para extensão/correção de material Fluxo executável para registrar uma solicitação no MDG quando for detectado que um plant não",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution."
      },
      substeps: [
        {
          id: "step_05_5.1",
          sourceRef: "5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_05_5.2",
          sourceRef: "5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_05_5.3",
          sourceRef: "5.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_05_5.4",
          sourceRef: "5.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_05_5.5",
          sourceRef: "5.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_05_5.6",
          sourceRef: "5.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_05_5.7",
          sourceRef: "5.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_05_5.8",
          sourceRef: "5.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_05_5.9",
          sourceRef: "5.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_05_5.10",
          sourceRef: "5.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_05_5.11",
          sourceRef: "5.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_06",
      sourceStep: "6",
      number: "06",
      title: "Trading Contract creation (WB21) e Verificação (WB23) Operational procedure para criar um Trading Contract usando WB21 (criação) e verificar via",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_06_6.1",
          sourceRef: "6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.1",
          sourceRef: "6.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.1.2",
          sourceRef: "6.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.2",
          sourceRef: "6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.3",
          sourceRef: "6.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.3.1",
          sourceRef: "6.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.4",
          sourceRef: "6.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.1",
          sourceRef: "6.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.2",
          sourceRef: "6.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.4.3",
          sourceRef: "6.4.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.5",
          sourceRef: "6.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.1",
          sourceRef: "6.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.2",
          sourceRef: "6.5.2",
          description: "Definir Distribution Channel como 'DR' (sempre).",
          classification: "ME"
        },
        {
          id: "step_06_6.5.3",
          sourceRef: "6.5.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.5.4",
          sourceRef: "6.5.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.5.5",
          sourceRef: "6.5.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.6",
          sourceRef: "6.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.6.1",
          sourceRef: "6.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.7",
          sourceRef: "6.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_06_6.7.1",
          sourceRef: "6.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.2",
          sourceRef: "6.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.3",
          sourceRef: "6.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.7.4",
          sourceRef: "6.7.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.8",
          sourceRef: "6.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.1",
          sourceRef: "6.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.2",
          sourceRef: "6.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_06_6.8.3",
          sourceRef: "6.8.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_07",
      sourceStep: "7",
      number: "07",
      title: "Invoice Processing Transportation & Terminal — locate VBDs e associar/acertar valores Executar a sequência completa para localizar, filtrar,",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_07_7.1",
          sourceRef: "7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.1",
          sourceRef: "7.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.1.2",
          sourceRef: "7.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.1.3",
          sourceRef: "7.1.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.2",
          sourceRef: "7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.2.1",
          sourceRef: "7.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.3",
          sourceRef: "7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.3.1",
          sourceRef: "7.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.3.2",
          sourceRef: "7.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.4",
          sourceRef: "7.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.4.1",
          sourceRef: "7.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.4.2",
          sourceRef: "7.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.5",
          sourceRef: "7.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.5.1",
          sourceRef: "7.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.5.2",
          sourceRef: "7.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.6",
          sourceRef: "7.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.6.1",
          sourceRef: "7.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.6.2",
          sourceRef: "7.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.7",
          sourceRef: "7.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.1",
          sourceRef: "7.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.7.2",
          sourceRef: "7.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.8",
          sourceRef: "7.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_07_7.8.1",
          sourceRef: "7.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.8.2",
          sourceRef: "7.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.9",
          sourceRef: "7.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.1",
          sourceRef: "7.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.2",
          sourceRef: "7.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_07_7.9.3",
          sourceRef: "7.9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.9.4",
          sourceRef: "7.9.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.10",
          sourceRef: "7.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.1",
          sourceRef: "7.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.10.2",
          sourceRef: "7.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.10.3",
          sourceRef: "7.10.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.11",
          sourceRef: "7.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_07_7.11.1",
          sourceRef: "7.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.11.2",
          sourceRef: "7.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.12",
          sourceRef: "7.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_07_7.12.1",
          sourceRef: "7.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_08",
      sourceStep: "8",
      number: "08",
      title: "Invoice Process de Pipeline — Tarifa de Pipeline Operational sequence para validar, locate VBDs, reconcile values e apply rules for invoi",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_08_8.1",
          sourceRef: "8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.1.1",
          sourceRef: "8.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.1.2",
          sourceRef: "8.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.2",
          sourceRef: "8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.2.1",
          sourceRef: "8.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.3",
          sourceRef: "8.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.3.1",
          sourceRef: "8.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.4",
          sourceRef: "8.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.4.1",
          sourceRef: "8.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.4.2",
          sourceRef: "8.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.5",
          sourceRef: "8.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_08_8.6",
          sourceRef: "8.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.1",
          sourceRef: "8.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.2",
          sourceRef: "8.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.6.3",
          sourceRef: "8.6.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.7",
          sourceRef: "8.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.1",
          sourceRef: "8.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.2",
          sourceRef: "8.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.7.3",
          sourceRef: "8.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.8",
          sourceRef: "8.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.8.1",
          sourceRef: "8.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.8.2",
          sourceRef: "8.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.9",
          sourceRef: "8.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.1",
          sourceRef: "8.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.2",
          sourceRef: "8.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.9.3",
          sourceRef: "8.9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.10",
          sourceRef: "8.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.1",
          sourceRef: "8.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_08_8.10.2",
          sourceRef: "8.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_08_8.10.3",
          sourceRef: "8.10.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_09",
      sourceStep: "9",
      number: "09",
      title: "Process de Débito Gain/Loss (Pipeline Gain/Loss) — Extração NK e criação/associação manual de VBD Executable sequence para validar a fatura Gain/Los",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_09_9.1",
          sourceRef: "9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.2",
          sourceRef: "9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.3",
          sourceRef: "9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.4",
          sourceRef: "9.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_09_9.5",
          sourceRef: "9.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.6",
          sourceRef: "9.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.7",
          sourceRef: "9.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.8",
          sourceRef: "9.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_09_9.9",
          sourceRef: "9.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.10",
          sourceRef: "9.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_09_9.11",
          sourceRef: "9.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.12",
          sourceRef: "9.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.13",
          sourceRef: "9.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.14",
          sourceRef: "9.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.15",
          sourceRef: "9.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.16",
          sourceRef: "9.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_09_9.17",
          sourceRef: "9.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_09_9.18",
          sourceRef: "9.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_10",
      sourceStep: "10",
      number: "10",
      title: "Process faturas Pipeline Y‑Grade e encargos de transporte: identificação, casamento e criação manual de VBD Executable sequence para identificar a",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_10_10.1",
          sourceRef: "10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_10_10.2",
          sourceRef: "10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.2.1",
          sourceRef: "10.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.3",
          sourceRef: "10.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.3.1",
          sourceRef: "10.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.4",
          sourceRef: "10.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.5",
          sourceRef: "10.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.6",
          sourceRef: "10.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.7",
          sourceRef: "10.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.8",
          sourceRef: "10.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.9",
          sourceRef: "10.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.10",
          sourceRef: "10.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.11",
          sourceRef: "10.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_10_10.12",
          sourceRef: "10.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_10_10.12.1",
          sourceRef: "10.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.13",
          sourceRef: "10.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.13.1",
          sourceRef: "10.13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.14",
          sourceRef: "10.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.15",
          sourceRef: "10.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.15.1",
          sourceRef: "10.15.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_10_10.16",
          sourceRef: "10.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_11",
      sourceStep: "11",
      number: "11",
      title: "Invoice Processing de Inspeção — fluxo Auto‑fired VBD Executable sequence para localizar, validar e processar faturas de inspeção que disparam",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "SA",
      classifications: ["SA", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Evaluator / Controle",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_11_11.1",
          sourceRef: "11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.1.1",
          sourceRef: "11.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.2",
          sourceRef: "11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.2.1",
          sourceRef: "11.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.3",
          sourceRef: "11.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.3.1",
          sourceRef: "11.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.3.2",
          sourceRef: "11.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.4",
          sourceRef: "11.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.4.1",
          sourceRef: "11.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.4.2",
          sourceRef: "11.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.5",
          sourceRef: "11.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_11_11.5.1",
          sourceRef: "11.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.5.2",
          sourceRef: "11.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.5.3",
          sourceRef: "11.5.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.6",
          sourceRef: "11.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.6.1",
          sourceRef: "11.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.6.2",
          sourceRef: "11.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.7",
          sourceRef: "11.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_11_11.8",
          sourceRef: "11.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_11_11.8.1",
          sourceRef: "11.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.8.2",
          sourceRef: "11.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.9",
          sourceRef: "11.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.9.1",
          sourceRef: "11.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.9.2",
          sourceRef: "11.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.10",
          sourceRef: "11.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.10.1",
          sourceRef: "11.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.11",
          sourceRef: "11.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_11_11.12",
          sourceRef: "11.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.12.1",
          sourceRef: "11.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_11_11.13",
          sourceRef: "11.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.1",
          sourceRef: "11.13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_11_11.13.2",
          sourceRef: "11.13.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_12",
      sourceStep: "12",
      number: "12",
      title: "Invoice Processing de Inspeção — Criação Manual de VBD (Trip e Non-Trip) Operational sequence para criar manualmente um VBD (ZEWB) for invoiras",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_12_12.1",
          sourceRef: "12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.2",
          sourceRef: "12.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_12_12.3",
          sourceRef: "12.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.4",
          sourceRef: "12.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_12_12.5",
          sourceRef: "12.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.6",
          sourceRef: "12.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.7",
          sourceRef: "12.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_12_12.8",
          sourceRef: "12.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.9",
          sourceRef: "12.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.10",
          sourceRef: "12.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.11",
          sourceRef: "12.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.12",
          sourceRef: "12.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.13",
          sourceRef: "12.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_12_12.14",
          sourceRef: "12.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_12_12.15",
          sourceRef: "12.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_13",
      sourceStep: "13",
      number: "13",
      title: "Roteamento a Scheduler e Processamento Crude Non‑Trip Related Executable sequence para identificar quando encaminhar uma fatura ao scheduler e o proc",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_13_13.1",
          sourceRef: "13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.2",
          sourceRef: "13.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.2.1",
          sourceRef: "13.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.3",
          sourceRef: "13.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.1",
          sourceRef: "13.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.3.2",
          sourceRef: "13.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.4",
          sourceRef: "13.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.4.1",
          sourceRef: "13.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_13_13.4.2",
          sourceRef: "13.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.5",
          sourceRef: "13.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.6",
          sourceRef: "13.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.6.1",
          sourceRef: "13.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.6.2",
          sourceRef: "13.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.7",
          sourceRef: "13.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.1",
          sourceRef: "13.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.2",
          sourceRef: "13.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.7.3",
          sourceRef: "13.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_13_13.8",
          sourceRef: "13.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_13_13.8.1",
          sourceRef: "13.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_13_13.8.2",
          sourceRef: "13.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.9",
          sourceRef: "13.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.1",
          sourceRef: "13.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.9.2",
          sourceRef: "13.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.10",
          sourceRef: "13.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.11",
          sourceRef: "13.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.1",
          sourceRef: "13.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.2",
          sourceRef: "13.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.3",
          sourceRef: "13.11.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_13_13.11.4",
          sourceRef: "13.11.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_14",
      sourceStep: "14",
      number: "14",
      title: "Process fatura do fornecedor SGS CANADA INC (Non‑PO, codificação fixa) Step-by-step procedure para verificar, classificar, apply rules, direc",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rules-coding",
      solutionIds: ["sol-rules-coding"],
      technologyType: "Rules Engine",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_14_14.1",
          sourceRef: "14.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.1.1",
          sourceRef: "14.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_14_14.2",
          sourceRef: "14.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.1",
          sourceRef: "14.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.2.2",
          sourceRef: "14.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.3",
          sourceRef: "14.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.3.1",
          sourceRef: "14.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.4",
          sourceRef: "14.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.4.1",
          sourceRef: "14.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.5",
          sourceRef: "14.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.1",
          sourceRef: "14.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.5.2",
          sourceRef: "14.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.6",
          sourceRef: "14.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.6.1",
          sourceRef: "14.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_14_14.6.2",
          sourceRef: "14.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.7",
          sourceRef: "14.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.7.1",
          sourceRef: "14.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_14_14.7.2",
          sourceRef: "14.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.8",
          sourceRef: "14.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.8.1",
          sourceRef: "14.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.8.2",
          sourceRef: "14.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.9",
          sourceRef: "14.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.9.1",
          sourceRef: "14.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.10",
          sourceRef: "14.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_14_14.10.1",
          sourceRef: "14.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_15",
      sourceStep: "15",
      number: "15",
      title: "Intercompany Processing — Exportar dados SAP (FAGLL03H) e preparar relatório WD06 Executar extração de lançamentos intercompany no SAP via FAGLL03H",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "codification",
      macroBlockName: "Codification",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Spreadsheet",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_15_15.1",
          sourceRef: "15.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.1.1",
          sourceRef: "15.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.1.2",
          sourceRef: "15.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.2",
          sourceRef: "15.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.1",
          sourceRef: "15.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.2",
          sourceRef: "15.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.2.3",
          sourceRef: "15.2.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.3",
          sourceRef: "15.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.1",
          sourceRef: "15.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.3.2",
          sourceRef: "15.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.4",
          sourceRef: "15.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.1",
          sourceRef: "15.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.2",
          sourceRef: "15.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.4.3",
          sourceRef: "15.4.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.5",
          sourceRef: "15.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.5.1",
          sourceRef: "15.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.5.2",
          sourceRef: "15.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.6",
          sourceRef: "15.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_15_15.6.1",
          sourceRef: "15.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.6.2",
          sourceRef: "15.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_15_15.7",
          sourceRef: "15.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.1",
          sourceRef: "15.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.2",
          sourceRef: "15.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.3",
          sourceRef: "15.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.7.4",
          sourceRef: "15.7.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.8",
          sourceRef: "15.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_15_15.9",
          sourceRef: "15.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.9.1",
          sourceRef: "15.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.9.2",
          sourceRef: "15.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_15_15.9.3",
          sourceRef: "15.9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.10",
          sourceRef: "15.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.10.1",
          sourceRef: "15.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.10.2",
          sourceRef: "15.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.11",
          sourceRef: "15.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.11.1",
          sourceRef: "15.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.11.2",
          sourceRef: "15.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.12",
          sourceRef: "15.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.1",
          sourceRef: "15.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.2",
          sourceRef: "15.12.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_15_15.12.3",
          sourceRef: "15.12.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_15_15.12.4",
          sourceRef: "15.12.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_16",
      sourceStep: "16",
      number: "16",
      title: "Processamento IC Pipeline Tariff / Terminal — ajustar Document Type SEC_SUM, criar/atualizar VBD e disparar incident em ServiceNow Sequência completa",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution."
      },
      substeps: [
        {
          id: "step_16_16.1",
          sourceRef: "16.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_16_16.1.1",
          sourceRef: "16.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.1.2",
          sourceRef: "16.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.1.3",
          sourceRef: "16.1.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.2",
          sourceRef: "16.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_16_16.2.1",
          sourceRef: "16.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.2.2",
          sourceRef: "16.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_16_16.3",
          sourceRef: "16.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_16_16.4",
          sourceRef: "16.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_16_16.5",
          sourceRef: "16.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_16_16.6",
          sourceRef: "16.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.7",
          sourceRef: "16.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_16_16.7.1",
          sourceRef: "16.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.7.2",
          sourceRef: "16.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.8",
          sourceRef: "16.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.9",
          sourceRef: "16.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_16_16.10",
          sourceRef: "16.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_17",
      sourceStep: "17",
      number: "17",
      title: "Nomination Key extraction via Fiori — obter NK, aplicar filtros e exportar Executable sequence para localizar Nomination Key no Fiori, aplicar os fi",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME"],
      macroBlockId: "intake",
      macroBlockName: "Intake",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_17_17.1",
          sourceRef: "17.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_17_17.2",
          sourceRef: "17.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_17_17.3",
          sourceRef: "17.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_17_17.4",
          sourceRef: "17.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_17_17.5",
          sourceRef: "17.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_17_17.6",
          sourceRef: "17.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_17_17.7",
          sourceRef: "17.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_17_17.8",
          sourceRef: "17.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_17_17.9",
          sourceRef: "17.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_18",
      sourceStep: "18",
      number: "18",
      title: "T4 (Transport4) — Conciliação Volume/Entrega e Process de Loss Allowance Executar a conciliação entre valores de fatura e entregas utilizando o Trans",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_18_18.1",
          sourceRef: "18.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.2",
          sourceRef: "18.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.3",
          sourceRef: "18.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.4",
          sourceRef: "18.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.5",
          sourceRef: "18.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.6",
          sourceRef: "18.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.7",
          sourceRef: "18.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.8",
          sourceRef: "18.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.9",
          sourceRef: "18.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.10",
          sourceRef: "18.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.11",
          sourceRef: "18.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.12",
          sourceRef: "18.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.13",
          sourceRef: "18.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.14",
          sourceRef: "18.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.15",
          sourceRef: "18.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.16",
          sourceRef: "18.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.17",
          sourceRef: "18.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.18",
          sourceRef: "18.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.19",
          sourceRef: "18.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.20",
          sourceRef: "18.20",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.21",
          sourceRef: "18.21",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.22",
          sourceRef: "18.22",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.23",
          sourceRef: "18.23",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.24",
          sourceRef: "18.24",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.25",
          sourceRef: "18.25",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_18_18.26",
          sourceRef: "18.26",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.27",
          sourceRef: "18.27",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.28",
          sourceRef: "18.28",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.29",
          sourceRef: "18.29",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_18_18.30",
          sourceRef: "18.30",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_18_18.31",
          sourceRef: "18.31",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_19",
      sourceStep: "19",
      number: "19",
      title: "Invoice Processing Gain & Loss — classificação, atribuição de GL/Company/Profit Center e envio para aprovações Executable procedure para iden",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_19_19.1",
          sourceRef: "19.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.1.1",
          sourceRef: "19.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.1.2",
          sourceRef: "19.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.2",
          sourceRef: "19.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.1",
          sourceRef: "19.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.2",
          sourceRef: "19.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.2.3",
          sourceRef: "19.2.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.3",
          sourceRef: "19.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.3.1",
          sourceRef: "19.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.4",
          sourceRef: "19.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.5",
          sourceRef: "19.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.5.1",
          sourceRef: "19.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_19_19.5.2",
          sourceRef: "19.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.5.3",
          sourceRef: "19.5.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_19_19.6",
          sourceRef: "19.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.6.1",
          sourceRef: "19.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.6.2",
          sourceRef: "19.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.6.3",
          sourceRef: "19.6.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.7",
          sourceRef: "19.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.7.1",
          sourceRef: "19.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.7.2",
          sourceRef: "19.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.7.3",
          sourceRef: "19.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.8",
          sourceRef: "19.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.8.1",
          sourceRef: "19.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.8.2",
          sourceRef: "19.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.8.3",
          sourceRef: "19.8.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.9",
          sourceRef: "19.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.1",
          sourceRef: "19.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.2",
          sourceRef: "19.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.9.3",
          sourceRef: "19.9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_19_19.10",
          sourceRef: "19.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.10.1",
          sourceRef: "19.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.11",
          sourceRef: "19.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.11.1",
          sourceRef: "19.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_19_19.12",
          sourceRef: "19.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_20",
      sourceStep: "20",
      number: "20",
      title: "Process 999+ (Analista) — gerar relatório 999, preparar arquivo e submeter para execução em background Executar a rotina 999+ para associar VBDs ao i",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-report",
      solutionIds: ["sol-rpa-report"],
      technologyType: "RPA / Spreadsheet",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_20_20.1",
          sourceRef: "20.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.1",
          sourceRef: "20.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.1.2",
          sourceRef: "20.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.2",
          sourceRef: "20.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.3",
          sourceRef: "20.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.4",
          sourceRef: "20.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.5",
          sourceRef: "20.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.6",
          sourceRef: "20.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.6.1",
          sourceRef: "20.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.6.2",
          sourceRef: "20.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.7",
          sourceRef: "20.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.8",
          sourceRef: "20.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.9",
          sourceRef: "20.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.10",
          sourceRef: "20.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.11",
          sourceRef: "20.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.12",
          sourceRef: "20.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.12.1",
          sourceRef: "20.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.13",
          sourceRef: "20.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.14",
          sourceRef: "20.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.14.1",
          sourceRef: "20.14.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.15",
          sourceRef: "20.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.15.1",
          sourceRef: "20.15.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.15.2",
          sourceRef: "20.15.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.16",
          sourceRef: "20.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.16.1",
          sourceRef: "20.16.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.17",
          sourceRef: "20.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.18",
          sourceRef: "20.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.19",
          sourceRef: "20.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.20",
          sourceRef: "20.20",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.21",
          sourceRef: "20.21",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.22",
          sourceRef: "20.22",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_20_20.23",
          sourceRef: "20.23",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.24",
          sourceRef: "20.24",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.24.1",
          sourceRef: "20.24.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_20_20.24.2",
          sourceRef: "20.24.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_20_20.25",
          sourceRef: "20.25",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_21",
      sourceStep: "21",
      number: "21",
      title: "Process 999+ (Supervisor) — Postagem, Clear Vendor e Ajustes (F-44 e controle de Due/Baseline Date) Executable sequence para o Supervisor realizar o",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_21_21.1",
          sourceRef: "21.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.1.1",
          sourceRef: "21.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_21_21.1.2",
          sourceRef: "21.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.2",
          sourceRef: "21.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.1",
          sourceRef: "21.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.2.2",
          sourceRef: "21.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.3",
          sourceRef: "21.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.1",
          sourceRef: "21.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.3.2",
          sourceRef: "21.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.4",
          sourceRef: "21.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.4.1",
          sourceRef: "21.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.4.2",
          sourceRef: "21.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.5",
          sourceRef: "21.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.5.1",
          sourceRef: "21.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.5.2",
          sourceRef: "21.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.6",
          sourceRef: "21.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_21_21.7",
          sourceRef: "21.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.7.1",
          sourceRef: "21.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.7.2",
          sourceRef: "21.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.8",
          sourceRef: "21.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_21_21.9",
          sourceRef: "21.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_21_21.9.1",
          sourceRef: "21.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.9.2",
          sourceRef: "21.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.10",
          sourceRef: "21.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_21_21.10.1",
          sourceRef: "21.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.10.2",
          sourceRef: "21.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_21_21.11",
          sourceRef: "21.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_22",
      sourceStep: "22",
      number: "22",
      title: "DCP Processing Front Range Transportation — extração do Nomination Key (NK) via Fiori e geração/tratamento de VBD para transport system USDCPPFTRG",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_22_22.1",
          sourceRef: "22.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.1.1",
          sourceRef: "22.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.1.2",
          sourceRef: "22.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.2",
          sourceRef: "22.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.2.1",
          sourceRef: "22.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.2.2",
          sourceRef: "22.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.3",
          sourceRef: "22.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.1",
          sourceRef: "22.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.3.2",
          sourceRef: "22.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.4",
          sourceRef: "22.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.1",
          sourceRef: "22.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.4.2",
          sourceRef: "22.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.5",
          sourceRef: "22.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.1",
          sourceRef: "22.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.5.2",
          sourceRef: "22.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_22_22.6",
          sourceRef: "22.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.7",
          sourceRef: "22.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.1",
          sourceRef: "22.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.2",
          sourceRef: "22.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.7.3",
          sourceRef: "22.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_22_22.8",
          sourceRef: "22.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_23",
      sourceStep: "23",
      number: "23",
      title: "Complete creation process e emissão de Credit Memo (VA01 → VF01 → VFO3) Executar todo o fluxo de rebill para crédito a partir das informações receb",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_23_23.1",
          sourceRef: "23.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.2",
          sourceRef: "23.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.3",
          sourceRef: "23.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.4",
          sourceRef: "23.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.5",
          sourceRef: "23.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_23_23.6",
          sourceRef: "23.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.7",
          sourceRef: "23.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.8",
          sourceRef: "23.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.9",
          sourceRef: "23.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.10",
          sourceRef: "23.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.11",
          sourceRef: "23.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.12",
          sourceRef: "23.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_23_23.13",
          sourceRef: "23.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.13.1",
          sourceRef: "23.13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.14",
          sourceRef: "23.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.15",
          sourceRef: "23.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.16",
          sourceRef: "23.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.17",
          sourceRef: "23.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_23_23.18",
          sourceRef: "23.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.19",
          sourceRef: "23.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_23_23.20",
          sourceRef: "23.20",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.21",
          sourceRef: "23.21",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.22",
          sourceRef: "23.22",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.23",
          sourceRef: "23.23",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_23_23.24",
          sourceRef: "23.24",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_24",
      sourceStep: "24",
      number: "24",
      title: "Rebill — Process de Debit Memo (ZEWB: criação do VBD, geração de output e envio ao Scheduler) Operational procedure para criar um Debit Memo em ZE",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_24_24.1",
          sourceRef: "24.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.1.1",
          sourceRef: "24.1.1",
          description: "Abrir T-code VFO3 (Display Billing Document).",
          classification: "ME"
        },
        {
          id: "step_24_24.1.2",
          sourceRef: "24.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.1.3",
          sourceRef: "24.1.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.2",
          sourceRef: "24.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.2.1",
          sourceRef: "24.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.2.2",
          sourceRef: "24.2.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.3",
          sourceRef: "24.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.3.1",
          sourceRef: "24.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.3.2",
          sourceRef: "24.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_24_24.4",
          sourceRef: "24.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.4.1",
          sourceRef: "24.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.4.2",
          sourceRef: "24.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.5",
          sourceRef: "24.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.5.1",
          sourceRef: "24.5.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.5.2",
          sourceRef: "24.5.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.6",
          sourceRef: "24.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.6.1",
          sourceRef: "24.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.6.2",
          sourceRef: "24.6.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.7",
          sourceRef: "24.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.1",
          sourceRef: "24.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.2",
          sourceRef: "24.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_24_24.7.3",
          sourceRef: "24.7.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.7.4",
          sourceRef: "24.7.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.8",
          sourceRef: "24.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.8.1",
          sourceRef: "24.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.8.2",
          sourceRef: "24.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.9",
          sourceRef: "24.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.1",
          sourceRef: "24.9.1",
          description: "Clicar 'Extras' → 'Message'.",
          classification: "ME"
        },
        {
          id: "step_24_24.9.2",
          sourceRef: "24.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.10",
          sourceRef: "24.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_24_24.10.1",
          sourceRef: "24.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_24_24.10.2",
          sourceRef: "24.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_25",
      sourceStep: "25",
      number: "25",
      title: "Invoice Process Revisada — Correção por crédito (original processado/impago) Operational sequence para identificar lançamento original, levantar d",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "exception",
      macroBlockName: "Exception",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-eval-anomaly",
      solutionIds: ["sol-eval-anomaly"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution."
      },
      substeps: [
        {
          id: "step_25_25.1",
          sourceRef: "25.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.2",
          sourceRef: "25.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.3",
          sourceRef: "25.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_25_25.4",
          sourceRef: "25.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_25_25.5",
          sourceRef: "25.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.6",
          sourceRef: "25.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.7",
          sourceRef: "25.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.8",
          sourceRef: "25.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.9",
          sourceRef: "25.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_25_25.10",
          sourceRef: "25.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.11",
          sourceRef: "25.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.12",
          sourceRef: "25.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.13",
          sourceRef: "25.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.14",
          sourceRef: "25.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.15",
          sourceRef: "25.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_25_25.16",
          sourceRef: "25.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_25_25.17",
          sourceRef: "25.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_25_25.18",
          sourceRef: "25.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_25_25.19",
          sourceRef: "25.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_26",
      sourceStep: "26",
      number: "26",
      title: "Process fatura de comissão única — identificar confirmation/deal, localizar VBD e preparar para postagem Step-by-step procedure para localizar o",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_26_26.1",
          sourceRef: "26.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.2",
          sourceRef: "26.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.3",
          sourceRef: "26.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.4",
          sourceRef: "26.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.5",
          sourceRef: "26.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.6",
          sourceRef: "26.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_26_26.7",
          sourceRef: "26.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.8",
          sourceRef: "26.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_26_26.9",
          sourceRef: "26.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.10",
          sourceRef: "26.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.11",
          sourceRef: "26.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.12",
          sourceRef: "26.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.13",
          sourceRef: "26.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.14",
          sourceRef: "26.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.15",
          sourceRef: "26.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.16",
          sourceRef: "26.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_26_26.17",
          sourceRef: "26.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_26_26.18",
          sourceRef: "26.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
    {
      id: "step_27",
      sourceStep: "27",
      number: "27",
      title: "Commission Process — identificar e reconciliar VBDs para Multi Commission e Crude Commission Operational procedure para identificar, selecionar e",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MA",
      classifications: ["MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-ia-matching",
      solutionIds: ["sol-ia-matching"],
      technologyType: "AI / Agent",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_27_27.1",
          sourceRef: "27.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.2",
          sourceRef: "27.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.2.1",
          sourceRef: "27.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.3",
          sourceRef: "27.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.4",
          sourceRef: "27.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.4.1",
          sourceRef: "27.4.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.4.2",
          sourceRef: "27.4.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.5",
          sourceRef: "27.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.6",
          sourceRef: "27.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.6.1",
          sourceRef: "27.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.7",
          sourceRef: "27.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.1",
          sourceRef: "27.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.7.2",
          sourceRef: "27.7.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.8",
          sourceRef: "27.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.8.1",
          sourceRef: "27.8.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.8.2",
          sourceRef: "27.8.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.9",
          sourceRef: "27.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.1",
          sourceRef: "27.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.9.2",
          sourceRef: "27.9.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.9.3",
          sourceRef: "27.9.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_27_27.10",
          sourceRef: "27.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.1",
          sourceRef: "27.10.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.10.2",
          sourceRef: "27.10.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.11",
          sourceRef: "27.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.11.1",
          sourceRef: "27.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_27_27.11.2",
          sourceRef: "27.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_27_27.11.3",
          sourceRef: "27.11.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
      ]
    },
    {
      id: "step_28",
      sourceStep: "28",
      number: "28",
      title: "Monthly processing de invoices ICE US Commodity Market — extração, cruzamento com VBDs e postagem Executable procedure para extrair invoices do p",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS", "MA"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-analytics-recon",
      solutionIds: ["sol-analytics-recon"],
      technologyType: "Analytics / Monitoramento",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_28_28.1",
          sourceRef: "28.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.1.1",
          sourceRef: "28.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.2",
          sourceRef: "28.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.2.1",
          sourceRef: "28.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.3",
          sourceRef: "28.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.3.1",
          sourceRef: "28.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.4",
          sourceRef: "28.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.5",
          sourceRef: "28.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.6",
          sourceRef: "28.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.6.1",
          sourceRef: "28.6.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.7",
          sourceRef: "28.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.7.1",
          sourceRef: "28.7.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.8",
          sourceRef: "28.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.9",
          sourceRef: "28.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.9.1",
          sourceRef: "28.9.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.10",
          sourceRef: "28.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.11",
          sourceRef: "28.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.11.1",
          sourceRef: "28.11.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.11.2",
          sourceRef: "28.11.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.12",
          sourceRef: "28.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.12.1",
          sourceRef: "28.12.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.12.2",
          sourceRef: "28.12.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.13",
          sourceRef: "28.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.13.1",
          sourceRef: "28.13.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.14",
          sourceRef: "28.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.15",
          sourceRef: "28.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.15.1",
          sourceRef: "28.15.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.16",
          sourceRef: "28.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.16.1",
          sourceRef: "28.16.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.16.2",
          sourceRef: "28.16.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.17",
          sourceRef: "28.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.17.1",
          sourceRef: "28.17.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.18",
          sourceRef: "28.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.19",
          sourceRef: "28.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.20",
          sourceRef: "28.20",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.21",
          sourceRef: "28.21",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.21.1",
          sourceRef: "28.21.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.22",
          sourceRef: "28.22",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_28_28.22.1",
          sourceRef: "28.22.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.22.2",
          sourceRef: "28.22.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.23",
          sourceRef: "28.23",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.23.1",
          sourceRef: "28.23.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.23.2",
          sourceRef: "28.23.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.24",
          sourceRef: "28.24",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.24.1",
          sourceRef: "28.24.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.25",
          sourceRef: "28.25",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_28_28.25.1",
          sourceRef: "28.25.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.25.2",
          sourceRef: "28.25.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.26",
          sourceRef: "28.26",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.26.1",
          sourceRef: "28.26.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_28_28.26.2",
          sourceRef: "28.26.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_28_28.26.3",
          sourceRef: "28.26.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_29",
      sourceStep: "29",
      number: "29",
      title: "Processamento de faturas Freight & Transportation — HARLEY MARINE (classificação Trip / Non‑Trip e criação de VBD via ZEWB) Step-by-step procedure",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "MS",
      classifications: ["MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_29_29.1",
          sourceRef: "29.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.2",
          sourceRef: "29.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_29_29.3",
          sourceRef: "29.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.4",
          sourceRef: "29.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_29_29.5",
          sourceRef: "29.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.6",
          sourceRef: "29.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.7",
          sourceRef: "29.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.8",
          sourceRef: "29.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.9",
          sourceRef: "29.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_29_29.10",
          sourceRef: "29.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.11",
          sourceRef: "29.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.12",
          sourceRef: "29.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_29_29.13",
          sourceRef: "29.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_30",
      sourceStep: "30",
      number: "30",
      title: "Process South Bow / TransCanada Keystone — reconciliação de arquivos, codificação e upload OAWD Step-by-step procedure para localizar e validar a",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "execution",
      macroBlockName: "Execution",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-rpa-upload-vim",
      solutionIds: ["sol-rpa-upload-vim"],
      technologyType: "RPA / Spreadsheet",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "high",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_30_30.1",
          sourceRef: "30.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.1.1",
          sourceRef: "30.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.2",
          sourceRef: "30.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.2.1",
          sourceRef: "30.2.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.3",
          sourceRef: "30.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.3.1",
          sourceRef: "30.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.3.2",
          sourceRef: "30.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.4",
          sourceRef: "30.4",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.5",
          sourceRef: "30.5",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.6",
          sourceRef: "30.6",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.7",
          sourceRef: "30.7",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.8",
          sourceRef: "30.8",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.9",
          sourceRef: "30.9",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.10",
          sourceRef: "30.10",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.11",
          sourceRef: "30.11",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.12",
          sourceRef: "30.12",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.13",
          sourceRef: "30.13",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.14",
          sourceRef: "30.14",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.15",
          sourceRef: "30.15",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.16",
          sourceRef: "30.16",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.17",
          sourceRef: "30.17",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.17.1",
          sourceRef: "30.17.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.18",
          sourceRef: "30.18",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.18.1",
          sourceRef: "30.18.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.19",
          sourceRef: "30.19",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_30_30.20",
          sourceRef: "30.20",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MA"
        },
        {
          id: "step_30_30.21",
          sourceRef: "30.21",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
      ]
    },
    {
      id: "step_31",
      sourceStep: "31",
      number: "31",
      title: "Invoice submission em S4 para aprovação Trip / Non‑Trip (Freight & Transportation) Procedimento para submeter fatura no S4, categorizando-a como Non-",
      description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
      classification: "ME",
      classifications: ["ME", "MS"],
      macroBlockId: "routing",
      macroBlockName: "Routing",
      capabilityId: "cap-auto",
      capabilityName: "Automation Capability",
      solutionId: "sol-wf-routing",
      solutionIds: ["sol-wf-routing"],
      technologyType: "Workflow",
      rationale: "This solution was selected because it perfectly balances efficiency and risk control. While repetitive data entry is automated, critical decision points remain under human supervision to guarantee accuracy and compliance.",
      effort: {
        level: "medium",
        score: 50,
        confidence: "medium",
        drivers: [],
        unknowns: []
      },
      humanInTheLoop: {
        hasHumanControl: true,
        level: "partial",
        description: "Human review is required for exception handling, final approvals, and any sensitive data modifications that fall outside the standard automation parameters."
      },
      substeps: [
        {
          id: "step_31_31.1",
          sourceRef: "31.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.1.1",
          sourceRef: "31.1.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "ME"
        },
        {
          id: "step_31_31.1.2",
          sourceRef: "31.1.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.2",
          sourceRef: "31.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.3",
          sourceRef: "31.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.1",
          sourceRef: "31.3.1",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.2",
          sourceRef: "31.3.2",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
        {
          id: "step_31_31.3.3",
          sourceRef: "31.3.3",
          description: "This step defines the operational sequence to be followed according to the standard procedure. It involves validating incoming data against current business rules, updating the relevant systems, and submitting the record for further processing or approval. Ensure all mandatory fields are verified prior to execution.",
          classification: "MS"
        },
      ]
    },
  ]
};

export const automationDetailMap: Record<string, ProcessAutomationDetailData> = {
  "special-handling": specialHandlingAutomationData
};