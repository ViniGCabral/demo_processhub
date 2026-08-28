import { create } from "zustand";
import { persist } from "zustand/middleware";
import { buildSaoMartinhoValueChain } from "@/data/saoMartinhoValueChain";

export interface L4Task {
  id: string;
  name: string;
  description?: string;
  responsible?: string;
  frequency?: string;
  code?: string;
  systems?: string;
  painPoints?: string;
  ftes?: string;
  structure?: string;
  businessUnit?: string;
  status: "active" | "inactive";
  documentationLink?: string;
}

export interface L3Process {
  id: string;
  name: string;
  description?: string;
  responsible?: string;
  frequency?: string;
  code?: string;
  systems?: string;
  painPoints?: string;
  ftes?: string;
  structure?: string;
  businessUnit?: string;
  status: "active" | "inactive";
  l4Tasks: L4Task[];
}

export interface L2Process {
  id: string;
  name: string;
  description?: string;
  responsible?: string;
  frequency?: string;
  code?: string;
  systems?: string;
  painPoints?: string;
  ftes?: string;
  structure?: string;
  businessUnit?: string;
  okr?: string;
  l3Processes: L3Process[];
}

export interface L1Process {
  id: string;
  name: string;
  namePT: string;
  nameEN: string;
  category: "SUPPORT" | "PRIMARY";
  description?: string;
  domain?: string;
  frequency?: string;
  responsible?: string;
  code?: string;
  systems?: string;
  painPoints?: string;
  ftes?: string;
  structure?: string;
  businessUnit?: string;
  l2Processes: L2Process[];
}

interface ValueChainState {
  l1Processes: L1Process[];
  isFirstAccess: boolean;
  setFirstAccessComplete: () => void;
  // L1 operations
  addL1: (l1: Omit<L1Process, "id" | "name" | "l2Processes">) => void;
  updateL1: (l1Id: string, data: Partial<L1Process>) => void;
  deleteL1: (l1Id: string) => void;
  // L2 operations
  addL2: (l1Id: string, l2: Omit<L2Process, "id" | "l3Processes">) => void;
  updateL2: (l1Id: string, l2Id: string, data: Partial<L2Process>) => void;
  deleteL2: (l1Id: string, l2Id: string) => void;
  // L3 operations
  addL3: (l1Id: string, l2Id: string, l3: Omit<L3Process, "id" | "l4Tasks">) => void;
  updateL3: (l1Id: string, l2Id: string, l3Id: string, data: Partial<L3Process>) => void;
  deleteL3: (l1Id: string, l2Id: string, l3Id: string) => void;
  // L4 operations
  addL4: (l1Id: string, l2Id: string, l3Id: string, l4: Omit<L4Task, "id">) => void;
  updateL4: (l1Id: string, l2Id: string, l3Id: string, l4Id: string, data: Partial<L4Task>) => void;
  deleteL4: (l1Id: string, l2Id: string, l3Id: string, l4Id: string) => void;
  moveL4: (
    sourceL1Id: string, sourceL2Id: string, sourceL3Id: string,
    targetL1Id: string, targetL2Id: string, targetL3Id: string,
    l4Id: string, targetIndex: number
  ) => void;
  // Utility
  clearAllProcesses: () => void;
  setL1Processes: (processes: L1Process[]) => void;
  // Getters for NewProcess integration
  getAllL1Names: () => string[];
  getAllL2Names: () => string[];
  getAllL3Names: () => string[];
  getAllL4Names: () => string[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mocked demo chain based on the São Martinho L1-L4 reference spreadsheet.
const initialL1Processes: L1Process[] = buildSaoMartinhoValueChain();

export const useValueChainStore = create<ValueChainState>()(
  persist(
    (set, get) => ({
      l1Processes: initialL1Processes,
      isFirstAccess: false,

      setFirstAccessComplete: () =>
        set({ isFirstAccess: false }),

      // L1 operations
      addL1: (l1Data) =>
        set((state) => ({
          l1Processes: [
            ...state.l1Processes,
            {
              ...l1Data,
              id: generateId(),
              name: l1Data.nameEN,
              l2Processes: [],
            },
          ],
        })),

      updateL1: (l1Id, data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  ...data,
                  name: data.nameEN || l1.nameEN,
                }
              : l1
          ),
        })),

      deleteL1: (l1Id) =>
        set((state) => ({
          l1Processes: state.l1Processes.filter((l1) => l1.id !== l1Id),
        })),

      // L2 operations
      addL2: (l1Id, l2Data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: [
                    ...l1.l2Processes,
                    { ...l2Data, id: generateId(), l3Processes: [] },
                  ],
                }
              : l1
          ),
        })),

      updateL2: (l1Id, l2Id, data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id ? { ...l2, ...data } : l2
                  ),
                }
              : l1
          ),
        })),

      deleteL2: (l1Id, l2Id) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.filter((l2) => l2.id !== l2Id),
                }
              : l1
          ),
        })),

      // L3 operations
      addL3: (l1Id, l2Id, l3Data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: [
                            ...l2.l3Processes,
                            { ...l3Data, id: generateId(), l4Tasks: [] },
                          ],
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      updateL3: (l1Id, l2Id, l3Id, data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: l2.l3Processes.map((l3) =>
                            l3.id === l3Id ? { ...l3, ...data } : l3
                          ),
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      deleteL3: (l1Id, l2Id, l3Id) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: l2.l3Processes.filter((l3) => l3.id !== l3Id),
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      // L4 operations
      addL4: (l1Id, l2Id, l3Id, l4Data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: l2.l3Processes.map((l3) =>
                            l3.id === l3Id
                              ? {
                                  ...l3,
                                  l4Tasks: [
                                    ...l3.l4Tasks,
                                    { ...l4Data, id: generateId() },
                                  ],
                                }
                              : l3
                          ),
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      updateL4: (l1Id, l2Id, l3Id, l4Id, data) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: l2.l3Processes.map((l3) =>
                            l3.id === l3Id
                              ? {
                                  ...l3,
                                  l4Tasks: l3.l4Tasks.map((l4) =>
                                    l4.id === l4Id ? { ...l4, ...data } : l4
                                  ),
                                }
                              : l3
                          ),
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      deleteL4: (l1Id, l2Id, l3Id, l4Id) =>
        set((state) => ({
          l1Processes: state.l1Processes.map((l1) =>
            l1.id === l1Id
              ? {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) =>
                    l2.id === l2Id
                      ? {
                          ...l2,
                          l3Processes: l2.l3Processes.map((l3) =>
                            l3.id === l3Id
                              ? {
                                  ...l3,
                                  l4Tasks: l3.l4Tasks.filter((l4) => l4.id !== l4Id),
                                }
                              : l3
                          ),
                        }
                      : l2
                  ),
                }
              : l1
          ),
        })),

      moveL4: (sourceL1Id, sourceL2Id, sourceL3Id, targetL1Id, targetL2Id, targetL3Id, l4Id, targetIndex) =>
        set((state) => {
          let movedL4: L4Task | null = null;
          const newL1Processes = state.l1Processes.map((l1) => {
            if (l1.id === sourceL1Id) {
              return {
                ...l1,
                l2Processes: l1.l2Processes.map((l2) => {
                  if (l2.id === sourceL2Id) {
                    return {
                      ...l2,
                      l3Processes: l2.l3Processes.map((l3) => {
                        if (l3.id === sourceL3Id) {
                          movedL4 = l3.l4Tasks.find((l4) => l4.id === l4Id) || null;
                          return {
                            ...l3,
                            l4Tasks: l3.l4Tasks.filter((l4) => l4.id !== l4Id),
                          };
                        }
                        return l3;
                      }),
                    };
                  }
                  return l2;
                }),
              };
            }
            return l1;
          });

          if (!movedL4) return state;

          return {
            l1Processes: newL1Processes.map((l1) => {
              if (l1.id === targetL1Id) {
                return {
                  ...l1,
                  l2Processes: l1.l2Processes.map((l2) => {
                    if (l2.id === targetL2Id) {
                      return {
                        ...l2,
                        l3Processes: l2.l3Processes.map((l3) => {
                          if (l3.id === targetL3Id) {
                            const newTasks = [...l3.l4Tasks];
                            newTasks.splice(targetIndex, 0, movedL4!);
                            return { ...l3, l4Tasks: newTasks };
                          }
                          return l3;
                        }),
                      };
                    }
                    return l2;
                  }),
                };
              }
              return l1;
            }),
          };
        }),

      // Utility functions
      clearAllProcesses: () =>
        set({ l1Processes: [], isFirstAccess: true }),

      setL1Processes: (processes) =>
        set({ l1Processes: processes, isFirstAccess: false }),

      // Getters for NewProcess integration
      getAllL1Names: () => {
        const state = get();
        return state.l1Processes.map((l1) => l1.nameEN);
      },

      getAllL2Names: () => {
        const state = get();
        const names: string[] = [];
        state.l1Processes.forEach((l1) => {
          l1.l2Processes.forEach((l2) => {
            if (!names.includes(l2.name)) {
              names.push(l2.name);
            }
          });
        });
        return names;
      },

      getAllL3Names: () => {
        const state = get();
        const names: string[] = [];
        state.l1Processes.forEach((l1) => {
          l1.l2Processes.forEach((l2) => {
            l2.l3Processes.forEach((l3) => {
              if (!names.includes(l3.name)) {
                names.push(l3.name);
              }
            });
          });
        });
        return names;
      },

      getAllL4Names: () => {
        const state = get();
        const names: string[] = [];
        state.l1Processes.forEach((l1) => {
          l1.l2Processes.forEach((l2) => {
            l2.l3Processes.forEach((l3) => {
              l3.l4Tasks.forEach((l4) => {
                if (!names.includes(l4.name)) {
                  names.push(l4.name);
                }
              });
            });
          });
        });
        return names;
      },
    }),
    {
      name: "value-chain-storage",
      version: 5,
      // Reseed persisted demos when the bundled São Martinho chain changes.
      migrate: () =>
        ({ l1Processes: buildSaoMartinhoValueChain(), isFirstAccess: false }) as never,
    }
  )
);

// AI Value Chain Generator - creates a sample value chain based on company name
export function generateAIValueChainForCompany(companyName: string): L1Process[] {
  const id = () => Math.random().toString(36).substr(2, 9);

  const l4 = (name: string): L4Task => ({ id: id(), name, status: "active" });

  const l3 = (name: string, desc: string, tasks: L4Task[]): L3Process => ({
    id: id(), name, description: desc, status: "active", l4Tasks: tasks,
  });

  const l2 = (name: string, desc: string, l3s: L3Process[]): L2Process => ({
    id: id(), name, description: desc, l3Processes: l3s,
  });

  return [
    // ═══════════════ SUPPORT ACTIVITIES ═══════════════
    {
      id: id(), name: "Firm Infrastructure", namePT: "Infraestrutura da Empresa", nameEN: "Firm Infrastructure",
      category: "SUPPORT", description: `General management, planning, finance, accounting, legal for ${companyName}`,
      l2Processes: [
        l2("Strategic Planning", "Long-term planning and goal setting", [
          l3("Corporate Strategy", "Define company vision and strategic objectives", [l4("Vision & Mission Review"), l4("Strategic Goal Setting"), l4("Competitive Analysis")]),
          l3("Business Planning", "Annual and quarterly business planning", [l4("Annual Plan Development"), l4("Quarterly OKR Setting")]),
          l3("M&A Strategy", "Mergers, acquisitions and partnerships evaluation", [l4("Target Identification"), l4("Due Diligence Coordination")]),
        ]),
        l2("Financial Management", "Budget and financial control", [
          l3("Budgeting & Forecasting", "Financial planning and budget allocation", [l4("Annual Budget Preparation"), l4("Rolling Forecast Updates"), l4("Variance Analysis")]),
          l3("Accounting & Reporting", "Financial record keeping and reporting", [l4("General Ledger Maintenance"), l4("Financial Statement Preparation"), l4("Regulatory Filing")]),
          l3("Treasury Management", "Cash flow and investment management", [l4("Cash Flow Forecasting"), l4("Bank Relationship Management")]),
        ]),
        l2("Legal & Compliance", "Legal affairs and regulatory compliance", [
          l3("Corporate Legal", "Legal counsel and contract review", [l4("Contract Drafting & Review"), l4("Litigation Management")]),
          l3("Regulatory Compliance", "Ensure adherence to regulations", [l4("Compliance Monitoring"), l4("Audit Coordination"), l4("Policy Documentation")]),
        ]),
        l2("Risk Management", "Enterprise risk identification and mitigation", [
          l3("Risk Assessment", "Identify and evaluate business risks", [l4("Risk Register Maintenance"), l4("Risk Scoring & Prioritization")]),
          l3("Business Continuity", "Ensure operational resilience", [l4("BCP Development"), l4("Disaster Recovery Testing")]),
        ]),
      ],
    },
    {
      id: id(), name: "Human Resource Management", namePT: "Gestão de Recursos Humanos", nameEN: "Human Resource Management",
      category: "SUPPORT", description: "Recruiting, hiring, training, development, compensation",
      l2Processes: [
        l2("Talent Acquisition", "Recruiting and hiring processes", [
          l3("Workforce Planning", "Identify staffing needs and plan hiring", [l4("Headcount Planning"), l4("Job Description Creation")]),
          l3("Recruitment", "Source and select candidates", [l4("Job Posting & Sourcing"), l4("Candidate Screening"), l4("Interview Coordination")]),
          l3("Onboarding", "New employee integration", [l4("Pre-boarding Setup"), l4("Orientation Program"), l4("Probation Review")]),
        ]),
        l2("Compensation & Benefits", "Employee compensation and benefits administration", [
          l3("Payroll Processing", "Calculate and distribute employee pay", [l4("Payroll Calculation"), l4("Tax Withholding"), l4("Payslip Distribution")]),
          l3("Benefits Administration", "Manage employee benefits programs", [l4("Health Insurance Enrollment"), l4("Retirement Plan Management")]),
        ]),
        l2("Training & Development", "Employee training and career growth programs", [
          l3("Learning Programs", "Design and deliver training content", [l4("Training Needs Analysis"), l4("Course Development"), l4("E-Learning Management")]),
          l3("Career Development", "Support employee career growth", [l4("Individual Development Plans"), l4("Mentoring Programs")]),
        ]),
        l2("Performance Management", "Employee evaluation and feedback", [
          l3("Goal Setting & Review", "Set and track employee performance goals", [l4("Annual Goal Setting"), l4("Mid-Year Review"), l4("Year-End Evaluation")]),
          l3("Feedback & Recognition", "Continuous feedback mechanisms", [l4("360° Feedback Process"), l4("Employee Recognition Programs")]),
        ]),
      ],
    },
    {
      id: id(), name: "Technology Development", namePT: "Desenvolvimento de Tecnologia", nameEN: "Technology Development",
      category: "SUPPORT", description: "R&D, process automation, technology-related activities",
      l2Processes: [
        l2("IT Infrastructure", "Manage hardware, networks, and cloud services", [
          l3("Network Management", "Maintain and optimize network infrastructure", [l4("Network Monitoring"), l4("Firewall Configuration"), l4("VPN Management")]),
          l3("Cloud Services", "Manage cloud platforms and services", [l4("Cloud Resource Provisioning"), l4("Cost Optimization"), l4("Migration Planning")]),
        ]),
        l2("Application Development", "Build and maintain software applications", [
          l3("Software Engineering", "Design, develop, and test applications", [l4("Requirements Gathering"), l4("Sprint Planning & Development"), l4("Code Review & Testing")]),
          l3("Release Management", "Coordinate software releases", [l4("Release Planning"), l4("Deployment Automation"), l4("Post-Release Monitoring")]),
        ]),
        l2("Cybersecurity", "Protect digital assets and data", [
          l3("Threat Management", "Detect and respond to security threats", [l4("Threat Intelligence Monitoring"), l4("Incident Response"), l4("Vulnerability Scanning")]),
          l3("Access Control", "Manage identity and access permissions", [l4("User Access Review"), l4("Privileged Access Management")]),
        ]),
        l2("Data & Analytics", "Data management and business intelligence", [
          l3("Data Governance", "Ensure data quality and compliance", [l4("Data Catalog Maintenance"), l4("Data Quality Monitoring"), l4("Privacy Compliance")]),
          l3("Business Intelligence", "Deliver insights through analytics", [l4("Dashboard Development"), l4("Ad-Hoc Reporting"), l4("Predictive Analytics")]),
        ]),
      ],
    },
    {
      id: id(), name: "Procurement", namePT: "Compras", nameEN: "Procurement",
      category: "SUPPORT", description: "Purchasing of raw materials, supplies, and other consumable items",
      l2Processes: [
        l2("Supplier Management", "Evaluate and manage supplier relationships", [
          l3("Supplier Selection", "Identify and qualify suppliers", [l4("RFP/RFQ Issuance"), l4("Supplier Evaluation"), l4("Vendor Onboarding")]),
          l3("Supplier Performance", "Monitor and improve supplier performance", [l4("KPI Tracking"), l4("Supplier Scorecard Review")]),
        ]),
        l2("Purchase-to-Pay", "End-to-end purchasing and payment process", [
          l3("Purchase Requisition", "Request and approve purchases", [l4("Requisition Creation"), l4("Approval Workflow"), l4("Purchase Order Generation")]),
          l3("Invoice Processing", "Receive and process supplier invoices", [l4("Invoice Receipt & Matching"), l4("Payment Scheduling"), l4("Dispute Resolution")]),
        ]),
        l2("Contract Management", "Manage supplier and service contracts", [
          l3("Contract Lifecycle", "Create, negotiate, and renew contracts", [l4("Contract Drafting"), l4("Negotiation & Approval"), l4("Renewal Management")]),
          l3("Contract Compliance", "Monitor contract adherence", [l4("SLA Monitoring"), l4("Compliance Auditing")]),
        ]),
        l2("Inventory Management", "Control and optimize inventory levels", [
          l3("Stock Control", "Monitor and manage inventory levels", [l4("Inventory Counting"), l4("Reorder Point Management"), l4("Dead Stock Identification")]),
          l3("Warehouse Operations", "Manage warehouse activities", [l4("Receiving & Put-Away"), l4("Picking & Packing")]),
        ]),
      ],
    },
    // ═══════════════ PRIMARY ACTIVITIES ═══════════════
    {
      id: id(), name: "Inbound Logistics", namePT: "Logística de Entrada", nameEN: "Inbound Logistics",
      category: "PRIMARY", description: "Receiving, storing, and distributing inputs",
      l2Processes: [
        l2("Receiving", "Inbound goods receipt and inspection", [
          l3("Goods Receipt", "Receive and verify incoming shipments", [l4("Shipment Scheduling"), l4("Unloading & Inspection"), l4("Goods Receipt Posting")]),
          l3("Quality Inspection", "Inspect received materials for quality", [l4("Sample Testing"), l4("Defect Reporting")]),
        ]),
        l2("Warehousing", "Storage and organization of materials", [
          l3("Storage Management", "Organize and maintain warehouse storage", [l4("Bin Location Assignment"), l4("FIFO/LIFO Management"), l4("Storage Condition Monitoring")]),
          l3("Inventory Tracking", "Track materials throughout the warehouse", [l4("Barcode/RFID Scanning"), l4("Cycle Counting")]),
        ]),
        l2("Material Handling", "Internal movement of materials", [
          l3("Internal Transport", "Move materials between locations", [l4("Forklift Operations"), l4("Conveyor System Management")]),
          l3("Material Staging", "Prepare materials for production use", [l4("Kit Assembly"), l4("Line-Side Delivery")]),
        ]),
      ],
    },
    {
      id: id(), name: "Operations", namePT: "Operações", nameEN: "Operations",
      category: "PRIMARY", description: "Transforming inputs into the final product",
      l2Processes: [
        l2("Production Planning", "Plan and schedule production activities", [
          l3("Demand Planning", "Forecast demand and plan production volumes", [l4("Demand Forecasting"), l4("Production Schedule Creation"), l4("Capacity Planning")]),
          l3("Material Requirements", "Plan material needs for production", [l4("BOM Management"), l4("MRP Processing"), l4("Shortage Resolution")]),
        ]),
        l2("Manufacturing", "Core production and assembly processes", [
          l3("Fabrication", "Transform raw materials into components", [l4("Machine Setup"), l4("Production Run Execution"), l4("Work Order Tracking")]),
          l3("Assembly", "Assemble components into finished products", [l4("Assembly Line Operations"), l4("Sub-Assembly Coordination"), l4("Final Assembly")]),
        ]),
        l2("Quality Control", "Ensure product quality standards", [
          l3("In-Process Quality", "Quality checks during production", [l4("Statistical Process Control"), l4("In-Line Inspection"), l4("Non-Conformance Reporting")]),
          l3("Final Quality Assurance", "End-of-line quality verification", [l4("Product Testing"), l4("Certificate of Conformance"), l4("Batch Release")]),
        ]),
        l2("Maintenance", "Equipment maintenance and reliability", [
          l3("Preventive Maintenance", "Scheduled maintenance activities", [l4("Maintenance Schedule Planning"), l4("Routine Inspections"), l4("Parts Replacement")]),
          l3("Corrective Maintenance", "Unplanned repair activities", [l4("Breakdown Response"), l4("Root Cause Analysis"), l4("Repair Execution")]),
        ]),
      ],
    },
    {
      id: id(), name: "Outbound Logistics", namePT: "Logística de Saída", nameEN: "Outbound Logistics",
      category: "PRIMARY", description: "Storing and distributing products to customers",
      l2Processes: [
        l2("Order Fulfillment", "Process and fulfill customer orders", [
          l3("Order Processing", "Receive and validate customer orders", [l4("Order Entry"), l4("Credit Check"), l4("Order Confirmation")]),
          l3("Pick, Pack & Ship", "Prepare orders for shipment", [l4("Wave Planning"), l4("Picking & Packing"), l4("Shipping Label Generation")]),
        ]),
        l2("Distribution", "Manage product distribution channels", [
          l3("Transportation Management", "Plan and execute shipments", [l4("Carrier Selection"), l4("Route Optimization"), l4("Freight Cost Management")]),
          l3("Last Mile Delivery", "Final delivery to customer", [l4("Delivery Scheduling"), l4("Proof of Delivery"), l4("Customer Notification")]),
        ]),
        l2("Returns Management", "Handle product returns and exchanges", [
          l3("Return Authorization", "Process return requests", [l4("RMA Creation"), l4("Return Eligibility Check")]),
          l3("Reverse Logistics", "Manage returned goods", [l4("Return Inspection"), l4("Refund Processing"), l4("Restocking")]),
        ]),
      ],
    },
    {
      id: id(), name: "Marketing & Sales", namePT: "Marketing e Vendas", nameEN: "Marketing & Sales",
      category: "PRIMARY", description: "Advertising, promotion, pricing, channel selection, sales force",
      l2Processes: [
        l2("Market Research", "Understand market trends and customer needs", [
          l3("Market Analysis", "Analyze market size, trends, and segments", [l4("Industry Research"), l4("Competitor Benchmarking"), l4("Market Sizing")]),
          l3("Customer Insights", "Gather and analyze customer feedback", [l4("Survey Design & Execution"), l4("Focus Group Coordination"), l4("Voice of Customer Analysis")]),
        ]),
        l2("Campaign Management", "Plan and execute marketing campaigns", [
          l3("Digital Marketing", "Online marketing channels and campaigns", [l4("SEO & Content Marketing"), l4("Paid Advertising Management"), l4("Social Media Management")]),
          l3("Brand Management", "Maintain and evolve brand identity", [l4("Brand Guidelines Maintenance"), l4("Creative Asset Production")]),
        ]),
        l2("Sales Operations", "Manage sales processes and pipeline", [
          l3("Lead Management", "Generate and qualify sales leads", [l4("Lead Generation"), l4("Lead Scoring & Qualification"), l4("Lead Assignment")]),
          l3("Deal Management", "Progress opportunities through pipeline", [l4("Proposal Creation"), l4("Negotiation Support"), l4("Contract Closing")]),
          l3("Sales Forecasting", "Predict future sales revenue", [l4("Pipeline Analysis"), l4("Revenue Forecasting")]),
        ]),
        l2("CRM", "Customer relationship management", [
          l3("Account Management", "Manage key customer accounts", [l4("Account Planning"), l4("Relationship Mapping"), l4("Account Review Meetings")]),
          l3("Customer Segmentation", "Classify customers by value and needs", [l4("Segmentation Modeling"), l4("Personalization Strategy")]),
        ]),
      ],
    },
    {
      id: id(), name: "Service", namePT: "Serviço", nameEN: "Service",
      category: "PRIMARY", description: "Installation, repair, customer service, training",
      l2Processes: [
        l2("Customer Support", "Handle customer inquiries and issues", [
          l3("Ticket Management", "Process and resolve support tickets", [l4("Ticket Triage"), l4("Issue Resolution"), l4("Customer Follow-up")]),
          l3("Self-Service Portal", "Enable customers to resolve issues independently", [l4("Knowledge Base Management"), l4("FAQ Maintenance"), l4("Chatbot Configuration")]),
          l3("Escalation Management", "Handle complex or critical issues", [l4("Escalation Routing"), l4("SLA Breach Monitoring"), l4("Executive Escalation")]),
        ]),
        l2("Field Service", "On-site service and technical support", [
          l3("Service Scheduling", "Plan and dispatch field technicians", [l4("Work Order Creation"), l4("Technician Dispatch"), l4("Route Planning")]),
          l3("On-Site Execution", "Perform service at customer location", [l4("Installation Services"), l4("Repair & Maintenance"), l4("Service Report Completion")]),
        ]),
        l2("Warranty Management", "Manage product warranties and claims", [
          l3("Warranty Registration", "Register and track product warranties", [l4("Warranty Activation"), l4("Coverage Verification")]),
          l3("Claims Processing", "Process warranty claims", [l4("Claim Submission Review"), l4("Parts Replacement Authorization"), l4("Claim Settlement")]),
        ]),
      ],
    },
  ];
}

// ============================================================
// Business Unit filtering helpers
// Items without an explicit business unit inherit the parent's scope,
// so they remain visible under any active filter.
// ============================================================
export function matchesBU(item: { businessUnit?: string }, bu: string | null): boolean {
  if (!bu) return true;
  if (!item.businessUnit) return true;
  return item.businessUnit === bu;
}

export function filterL1ByBU(l1: L1Process, bu: string | null): L1Process {
  if (!bu) return l1;
  return {
    ...l1,
    l2Processes: l1.l2Processes
      .filter((l2) => matchesBU(l2, bu))
      .map((l2) => ({
        ...l2,
        l3Processes: l2.l3Processes
          .filter((l3) => matchesBU(l3, bu))
          .map((l3) => ({
            ...l3,
            l4Tasks: l3.l4Tasks.filter((l4) => matchesBU(l4, bu)),
          })),
      })),
  };
}

export function filterChainByBU(l1Processes: L1Process[], bu: string | null): L1Process[] {
  if (!bu) return l1Processes;
  return l1Processes.filter((l1) => matchesBU(l1, bu)).map((l1) => filterL1ByBU(l1, bu));
}

export function collectBusinessUnits(l1Processes: L1Process[]): string[] {
  const set = new Set<string>();
  l1Processes.forEach((l1) => {
    if (l1.businessUnit) set.add(l1.businessUnit);
    l1.l2Processes.forEach((l2) => {
      if (l2.businessUnit) set.add(l2.businessUnit);
      l2.l3Processes.forEach((l3) => {
        if (l3.businessUnit) set.add(l3.businessUnit);
        l3.l4Tasks.forEach((l4) => {
          if (l4.businessUnit) set.add(l4.businessUnit);
        });
      });
    });
  });
  return Array.from(set);
}
