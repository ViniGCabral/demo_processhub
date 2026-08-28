import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUseCaseStore } from "@/stores/useCaseStore";
import { UseCaseStepper } from "@/components/usecases/UseCaseStepper";
import { UseCaseContextStep } from "@/components/usecases/UseCaseContextStep";
import { UseCaseListStep } from "@/components/usecases/UseCaseListStep";
import { UseCaseDetailPage } from "@/components/usecases/UseCaseDetailPage";
import { UseCaseGeneratingScreen } from "@/components/usecases/UseCaseGeneratingScreen";

interface UseCasesProps {
  onLogout: () => void;
}

export function UseCases({ onLogout }: UseCasesProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { currentStep, setStep, reset, isGenerating } = useUseCaseStore();

  const level = searchParams.get("level") || undefined;
  const sourceId = searchParams.get("sourceId") || undefined;
  const sourceName = searchParams.get("sourceName") || undefined;
  const l1Id = searchParams.get("l1Id") || undefined;

  const isStandalone = !l1Id && !sourceId;

  // Reset store when unmounting
  useEffect(() => {
    return () => reset();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar onLogout={onLogout} />

      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => {
              if (isStandalone) {
                navigate("/");
              } else {
                const backL1 = l1Id || sourceId;
                navigate(`/architecture?l1Id=${backL1}`);
              }
            }}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:opacity-70 text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
            {isStandalone
              ? (language === "PT" ? "Voltar para Home" : "Back to Home")
              : (language === "PT" ? "Voltar para Arquitetura" : "Back to Architecture")}
          </button>

          {isGenerating ? (
            <UseCaseGeneratingScreen />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-foreground">
                  {language === "PT" ? "Casos de Uso" : "Use Cases"}
                </h1>
                <UseCaseStepper currentStep={currentStep} onStepClick={setStep} />
              </div>

              {currentStep === 0 && (
                <UseCaseContextStep
                  initialLevel={level}
                  initialSourceId={sourceId}
                  initialSourceName={sourceName}
                  initialL1Id={l1Id}
                />
              )}
              {currentStep === 1 && <UseCaseListStep />}
              {currentStep === 2 && <UseCaseDetailPage />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
