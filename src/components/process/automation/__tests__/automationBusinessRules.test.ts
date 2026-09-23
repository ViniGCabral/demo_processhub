import { describe, it, expect } from "vitest";
import { specialHandlingAutomationData } from "@/data/automationDetailData";
import { getProcessAutomationDetail, calculateCatalogKPIs } from "../automationDetailAdapter";

describe("Automation Detailing - Business Rules & Components Logic", () => {
  it("should enforce distinct separation between observed SOP evidence, AI inference, and future candidates", () => {
    const data = specialHandlingAutomationData;

    data.steps.forEach((step) => {
      // 1. O que foi observado na SOP deve ser fático
      expect(step.evidence?.rawDescription).toBeDefined();
      expect(step.evidence?.sourceReference).toBeDefined();

      // 2. O que a IA inferiu deve ter racional explícito
      if (step.aiInterpretation) {
        expect(step.aiInterpretation.classificationRationale).toBeDefined();
      }

      // 3. O que pode ser construído no futuro deve ser marcado como candidato a validar
      if (step.technologyOptions && step.technologyOptions.length > 0) {
        step.technologyOptions.forEach((tech) => {
          expect(tech.validationStatus).toBe("needs_validation");
          expect(["primary", "alternative", "fallback"]).toContain(tech.role);
        });
      }
    });

    data.solutions.forEach((sol) => {
      expect(sol.status).toBe("future_state_proposal");
      expect(sol.stepIds.length).toBeGreaterThan(0);
      expect(sol.technologyOptions.length).toBeGreaterThan(0);
    });
  });

  it("should never display future candidate technologies as already implemented", () => {
    const data = specialHandlingAutomationData;
    const allCandidateTechs = data.solutions.flatMap((s) => s.technologyOptions);

    allCandidateTechs.forEach((t) => {
      expect(t.validationStatus).toBe("needs_validation");
    });
  });

  it("should treat Decision Table as a rule mechanism executed by an engine or workflow, not an isolated tech", () => {
    const data = specialHandlingAutomationData;

    // sol-02 e sol-04 possuem mecanismos de regras / tabela de decisão
    const sol02 = data.solutions.find((s) => s.id === "sol-02");
    expect(sol02).toBeDefined();
    expect(sol02?.implementationPaths).toBeDefined();

    // Verifica que existe caminho com mecanismo de regra e tecnologias executoras (BRF+, etc)
    const pathsWithMechanism = sol02?.implementationPaths?.filter((p) => p.mechanism);
    expect(pathsWithMechanism?.length).toBeGreaterThan(0);

    const allTechsSol02 = sol02?.implementationPaths?.flatMap((p) => p.technologies.map((t) => t.name)).join(", ");
    expect(allTechsSol02).toMatch(/SAP BRF\+|motor de regras|workflow/i);

    const sol04 = data.solutions.find((s) => s.id === "sol-04");
    expect(sol04).toBeDefined();
    const decisionPath04 = sol04?.implementationPaths?.find((p) => p.mechanism?.includes("regras") || p.mechanism?.includes("Tabela"));
    expect(decisionPath04).toBeDefined();
  });

  it("should correctly compute the 5 Catalog KPIs", () => {
    const data = specialHandlingAutomationData;
    const kpis = calculateCatalogKPIs(data.solutions);

    // KPI 1: Total de soluções futuras
    expect(kpis.totalSolutions).toBe(6);

    // KPI 2: Total de capacidades (6 capacidades distintas)
    expect(kpis.totalCapabilities).toBe(6);

    // KPI 3: Tecnologias candidatas únicas
    expect(kpis.totalCandidateTechnologies).toBeGreaterThan(5);

    // KPI 4: Steps endereçados
    expect(kpis.totalAddressedSteps).toBe(27);

    // KPI 5: Soluções com humano no loop (sol-02, sol-04, sol-06)
    expect(kpis.totalHumanInTheLoop).toBe(3);
  });

  it("should categorize implementation alternatives by horizons: quick_win, intermediate, transformative", () => {
    const data = specialHandlingAutomationData;
    const allProfiles = data.solutions.flatMap((s) =>
      (s.implementationPaths || []).map((p) => p.profile)
    );

    expect(allProfiles).toContain("quick_win");
    expect(allProfiles).toContain("intermediate");
    expect(allProfiles).toContain("transformative");
  });

  it("should handle empty search results and preserve data consistency", () => {
    const data = specialHandlingAutomationData;
    const impossibleTerm = "termo_completamente_inexistente_123456";

    const filtered = data.steps.filter((s) =>
      s.title.toLowerCase().includes(impossibleTerm)
    );
    expect(filtered.length).toBe(0);

    const filteredSolutions = data.solutions.filter((s) =>
      s.name.toLowerCase().includes(impossibleTerm)
    );
    expect(filteredSolutions.length).toBe(0);
  });

  it("should properly adapt legacy payload where technology is empty or dash", () => {
    const legacyEmptyTech = [
      { step: "01", title: "Atividade manual sem tecnologia", classification: "ME" as const, tech: "—" },
    ];

    const adapted = getProcessAutomationDetail("test-id", "Processo Vazio", legacyEmptyTech);
    expect(adapted.steps[0].technologyOptions?.length).toBe(0);
    expect(adapted.steps[0].capabilityName).toBeUndefined();
    expect(adapted.steps[0].solutionName).toBeUndefined();
    expect(adapted.solutions.length).toBe(0);

    // KPIs para payload legado com 0 soluções
    const kpis = calculateCatalogKPIs(adapted.solutions);
    expect(kpis.totalSolutions).toBe(0);
    expect(kpis.totalCapabilities).toBe(0);
    expect(kpis.totalCandidateTechnologies).toBe(0);
    expect(kpis.totalAddressedSteps).toBe(0);
    expect(kpis.totalHumanInTheLoop).toBe(0);
  });
});
