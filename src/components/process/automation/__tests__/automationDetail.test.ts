import { describe, it, expect } from "vitest";
import {
  getProcessAutomationDetail,
  getClassificationMeta,
  getEffortBadgeInfo,
  getImpactBadgeInfo,
  getProfileBadgeInfo,
  getStatusBadgeInfo,
  LegacyAutomationRow,
} from "../automationDetailAdapter";
import { specialHandlingAutomationData } from "@/data/automationDetailData";

describe("Automation Detailing - Data & Adapter Tests", () => {
  it("should return rich reference dataset for Special Handling process", () => {
    const data = getProcessAutomationDetail("special-handling", "Pagamentos manuais (NA)");

    expect(data.processName).toBe("Pagamentos manuais (NA)");
    expect(data.sopCode).toBe("S2P08");
    expect(data.macroBlocks.length).toBe(5);
    expect(data.steps.length).toBe(27);
    expect(data.solutions.length).toBe(6);

    // Verify macroblock structure
    const mb1 = data.macroBlocks[0];
    expect(mb1.id).toBe("mb-01");
    expect(mb1.name).toBe("Entrada e preparação");
    expect(mb1.stepCount).toBe(13);

    // Verify step fields
    const step01 = data.steps[0];
    expect(step01.id).toBe("01");
    expect(step01.classification).toBe("ME");
    expect(step01.capabilityName).toBe("Estruturação de dados");
    expect(step01.solutionName).toBe("Automação estruturada de parâmetros e preparação de planilha");
    expect(step01.technologyOptions?.length).toBeGreaterThan(0);
    expect(step01.technologyOptions?.[0].role).toBe("primary");
    expect(step01.evidence?.rawDescription).toBeDefined();
    expect(step01.aiInterpretation?.classificationRationale).toBeDefined();
    expect(step01.effort?.level).toBe("low");
    expect(step01.humanInTheLoop?.hasHumanControl).toBe(false);

    // Verify step with human-in-the-loop (e.g. MNA approval)
    const step19 = data.steps.find((s) => s.id === "19");
    expect(step19).toBeDefined();
    expect(step19?.classification).toBe("MNA");
    expect(step19?.humanInTheLoop?.hasHumanControl).toBe(true);
    expect(step19?.humanInTheLoop?.mandatoryApproval).toBe(true);
    expect(step19?.effort?.level).toBe("not_applicable");
  });

  it("should gracefully adapt legacy 4-column payload without crashing", () => {
    const legacyPayload: LegacyAutomationRow[] = [
      { step: "1.1", title: "Abrir relatório no Workday", classification: "ME", tech: "RPA" },
      { step: "1.2", title: "Aplicar filtro regional", classification: "MS", tech: "Integração via API" },
      { step: "2.1", title: "Aguardar aprovação", classification: "MNA", tech: "—" },
    ];

    const data = getProcessAutomationDetail("legacy-proc-99", "Processo Antigo Legado", legacyPayload);

    expect(data.steps.length).toBe(3);
    expect(data.macroBlocks.length).toBe(1);

    const step1 = data.steps[0];
    expect(step1.id).toBe("1.1");
    expect(step1.title).toBe("Abrir relatório no Workday");
    expect(step1.classification).toBe("ME");
    expect(step1.technology).toBe("RPA");

    // Must NOT invent false capabilities or solutions
    expect(step1.capabilityName).toBeUndefined();
    expect(step1.solutionName).toBeUndefined();

    // The legacy tech is preserved with validation status needs_validation
    expect(step1.technologyOptions?.[0].name).toBe("RPA");
    expect(step1.technologyOptions?.[0].validationStatus).toBe("needs_validation");
  });

  it("should correctly calculate classification metadata", () => {
    const me = getClassificationMeta("ME");
    expect(me.label).toBe("ME");
    expect(me.full).toBe("Manual Estruturado");
    expect(me.color).toContain("red");

    const mna = getClassificationMeta("MNA");
    expect(mna.label).toBe("MNA");
    expect(mna.full).toBe("Manual Não-Automatizável");

    const au = getClassificationMeta("AU");
    expect(au.label).toBe("AU");
    expect(au.full).toBe("Automatizado");
    expect(au.color).toContain("emerald");
  });

  it("should correctly calculate effort badge info and dot count", () => {
    const veryHigh = getEffortBadgeInfo("very_high");
    expect(veryHigh.label).toBe("Muito Alto");
    expect(veryHigh.dots).toBe(5);

    const high = getEffortBadgeInfo("high");
    expect(high.label).toBe("Alto");
    expect(high.dots).toBe(4);

    const medium = getEffortBadgeInfo("medium");
    expect(medium.label).toBe("Médio");
    expect(medium.dots).toBe(3);

    const low = getEffortBadgeInfo("low");
    expect(low.label).toBe("Baixo");
    expect(low.dots).toBe(2);

    const na = getEffortBadgeInfo("not_applicable");
    expect(na.label).toBe("Não aplicável");
    expect(na.dots).toBe(0);

    const missing = getEffortBadgeInfo(undefined);
    expect(missing.label).toBe("Não informado");
    expect(missing.dots).toBe(0);
  });

  it("should filter steps by macroblock correctly", () => {
    const data = specialHandlingAutomationData;
    const mb1Steps = data.steps.filter((s) => s.macroBlockId === "mb-01");
    expect(mb1Steps.length).toBe(13);

    const mb2Steps = data.steps.filter((s) => s.macroBlockId === "mb-02");
    expect(mb2Steps.length).toBe(1);

    const mb3Steps = data.steps.filter((s) => s.macroBlockId === "mb-03");
    expect(mb3Steps.length).toBe(8);

    const mb4Steps = data.steps.filter((s) => s.macroBlockId === "mb-04");
    expect(mb4Steps.length).toBe(2);

    const mb5Steps = data.steps.filter((s) => s.macroBlockId === "mb-05");
    expect(mb5Steps.length).toBe(3);

    expect(data.steps.length).toBe(27);
  });

  it("should filter solutions by candidate technology and search term", () => {
    const data = specialHandlingAutomationData;

    // Filter by technology "Power Query"
    const powerQuerySolutions = data.solutions.filter((sol) =>
      sol.technologyOptions.some((t) => t.name === "Power Query")
    );
    expect(powerQuerySolutions.length).toBe(1);
    expect(powerQuerySolutions[0].id).toBe("sol-01");

    // Search by term "aprovação"
    const term = "aprovação";
    const searchResults = data.solutions.filter(
      (sol) =>
        sol.name.toLowerCase().includes(term) ||
        sol.description.toLowerCase().includes(term) ||
        sol.capabilityName.toLowerCase().includes(term)
    );
    expect(searchResults.length).toBeGreaterThan(0);
  });

  it("should correctly calculate impact, profile, and status badge info", () => {
    // Impact
    expect(getImpactBadgeInfo("transformative").label).toBe("Transformador");
    expect(getImpactBadgeInfo("relevant").label).toBe("Relevante");
    expect(getImpactBadgeInfo("incremental").label).toBe("Incremental");
    expect(getImpactBadgeInfo("not_assessed").label).toBe("Não avaliado");

    // Profile
    expect(getProfileBadgeInfo("quick_win").label).toBe("Quick win");
    expect(getProfileBadgeInfo("intermediate").label).toBe("Intermediário");
    expect(getProfileBadgeInfo("transformative").label).toBe("Transformação");

    // Status
    expect(getStatusBadgeInfo("future_state_proposal").label).toBe("Proposta futura");
    expect(getStatusBadgeInfo("needs_validation").label).toBe("Requer validação");
    expect(getStatusBadgeInfo("technically_validated").label).toBe("Validado tecnicamente");
  });
});

