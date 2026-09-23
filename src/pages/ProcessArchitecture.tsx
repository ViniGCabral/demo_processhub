import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Layers, Network } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValueChainOnboarding } from "@/components/architecture/ValueChainOnboarding";
import { ArchitectureCanvas } from "@/components/architecture/ArchitectureCanvas";
import { ArchitectureHeader } from "@/components/architecture/ArchitectureHeader";
import {
  useValueChainStore,
  generateAIValueChainForCompany,
} from "@/stores/valueChainStore";
import { useJourneyStore } from "@/stores/journeyStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProcessArchitectureProps {
  onLogout: () => void;
}

export function ProcessArchitecture({ onLogout }: ProcessArchitectureProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { language } = useLanguage();
  const pt = language === "PT";
  const { l1Processes, isFirstAccess, setFirstAccessComplete, setL1Processes } =
    useValueChainStore();

  const handleCreateFromScratch = () => {
    setFirstAccessComplete();
    toast.success(
      pt
        ? "Comece a criar sua cadeia de valor!"
        : "Start creating your value chain!"
    );
  };

  const handleGenerateWithAI = (companyName: string) => {
    const generatedProcesses = generateAIValueChainForCompany(companyName);
    setL1Processes(generatedProcesses);
    toast.success(
      pt
        ? `Cadeia de valor gerada para "${companyName}"!`
        : `Value chain generated for "${companyName}"!`
    );
  };

  const handleAIGeneration = (
    option: "full" | "existing" | "new",
    targetL1Id?: string,
    newE2EName?: string
  ) => {
    const { addL1, updateL1 } = useValueChainStore.getState();

    if (option === "full") {
      const generatedProcesses = generateAIValueChainForCompany("Company");
      setL1Processes(generatedProcesses);
      toast.success(
        pt
          ? "Cadeia de valor completa gerada!"
          : "Full value chain generated!"
      );
    } else if (option === "existing" && targetL1Id) {
      const existingL1 = l1Processes.find((l1) => l1.id === targetL1Id);
      if (existingL1) {
        const sampleL2s = [
          { id: `l2-${Date.now()}-1`, name: "Process Planning", l3Processes: [] },
          { id: `l2-${Date.now()}-2`, name: "Execution & Control", l3Processes: [] },
          { id: `l2-${Date.now()}-3`, name: "Review & Improvement", l3Processes: [] },
        ];
        updateL1(targetL1Id, { l2Processes: sampleL2s });
        toast.success(
          pt ? "E2E regenerado com sucesso!" : "E2E regenerated!"
        );
      }
    } else if (option === "new" && newE2EName) {
      const sampleL2s = [
        { id: `l2-${Date.now()}-1`, name: `${newE2EName} - Planning`, l3Processes: [] },
        { id: `l2-${Date.now()}-2`, name: `${newE2EName} - Execution`, l3Processes: [] },
        { id: `l2-${Date.now()}-3`, name: `${newE2EName} - Control`, l3Processes: [] },
      ];
      addL1({
        nameEN: newE2EName,
        namePT: newE2EName,
        category: "PRIMARY",
        description: `AI-generated E2E: ${newE2EName}`,
      });
      const newL1 = useValueChainStore
        .getState()
        .l1Processes.find((l1) => l1.nameEN === newE2EName);
      if (newL1) updateL1(newL1.id, { l2Processes: sampleL2s });
      toast.success(
        pt
          ? `Novo E2E "${newE2EName}" criado!`
          : `New E2E "${newE2EName}" created!`
      );
    }
  };

  const showOnboarding = isFirstAccess && l1Processes.length === 0;

  // Exibir header global apenas na tela inicial de arquitetura (ocultando em subtelas de L1, L2, L3, L4, processo ou detalhe de jornada)
  const isSubScreen = Boolean(
    searchParams.get("l1") || 
    searchParams.get("l2") || 
    searchParams.get("l3") || 
    searchParams.get("l4") || 
    searchParams.get("processId")
  );
  const showHeader = !showOnboarding && !isSubScreen;

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <TopBar onLogout={onLogout} />

      <main className="flex-1 p-4 lg:p-8">
        <div className="w-full mx-auto">
          
          {/* ── View Toggle & Header (apenas na tela inicial de arquitetura) ────────────────── */}
          {showHeader && (
            <ArchitectureHeader 
              onImportBpmn={() => toast.info(pt ? "Funcionalidade de importação BPMN em breve." : "BPMN import coming soon.")}
              onGenerateAI={() => handleAIGeneration("full")}
              onCreate={() => toast.info(pt ? "Modal de criação L1" : "L1 creation modal")}
            />
          )}

          {/* ── Content ──────────────────────────────────────────── */}
          {showOnboarding ? (
            <ValueChainOnboarding
              onCreateFromScratch={handleCreateFromScratch}
              onGenerateWithAI={handleGenerateWithAI}
            />
          ) : (
            <ArchitectureCanvas onGenerateAI={handleAIGeneration} />
          )}
        </div>
      </main>
    </div>
  );
}
