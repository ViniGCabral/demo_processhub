import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { ValueChainOnboarding } from "@/components/architecture/ValueChainOnboarding";
import { ArchitectureCanvas } from "@/components/architecture/ArchitectureCanvas";
import {
  useValueChainStore,
  generateAIValueChainForCompany,
} from "@/stores/valueChainStore";
import { toast } from "sonner";

interface ProcessArchitectureProps {
  onLogout: () => void;
}

export function ProcessArchitecture({ onLogout }: ProcessArchitectureProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { l1Processes, isFirstAccess, setFirstAccessComplete, setL1Processes } =
    useValueChainStore();

  const handleCreateFromScratch = () => {
    setFirstAccessComplete();
    toast.success(
      language === "PT"
        ? "Comece a criar sua cadeia de valor!"
        : "Start creating your value chain!"
    );
  };

  const handleGenerateWithAI = (companyName: string) => {
    const generatedProcesses = generateAIValueChainForCompany(companyName);
    setL1Processes(generatedProcesses);
    toast.success(
      language === "PT"
        ? `Cadeia de valor gerada para ${companyName}!`
        : `Value chain generated for ${companyName}!`
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
        language === "PT"
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
          language === "PT" ? "E2E regenerado com sucesso!" : "E2E regenerated!"
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
        language === "PT"
          ? `Novo E2E "${newE2EName}" criado!`
          : `New E2E "${newE2EName}" created!`
      );
    }
  };

  const showOnboarding = isFirstAccess && l1Processes.length === 0;

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <TopBar onLogout={onLogout} />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-[1400px] mx-auto">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-[#0C1BA8] text-[#A5A7B0]"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === "PT" ? "Voltar para a tela inicial" : "Back to Home"}
          </button>

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
