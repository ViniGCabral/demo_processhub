import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface UseCaseStepperProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

const steps = [
  { labelPT: "Contexto", labelEN: "Context" },
  { labelPT: "Casos de Uso", labelEN: "Use Cases" },
  { labelPT: "Detalhe", labelEN: "Detail" },
];

export function UseCaseStepper({ currentStep, onStepClick }: UseCaseStepperProps) {
  const { language } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isCurrent = index === currentStep;
        const isClickable = index <= currentStep;

        return (
          <div key={index} className="flex items-center gap-2">
            <button
              onClick={() => isClickable && onStepClick(index)}
              disabled={!isClickable}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                isCurrent && "bg-chain text-white",
                isCompleted && "bg-chain-bg text-chain-dark cursor-pointer hover:bg-chain-light",
                !isCurrent && !isCompleted && "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isCompleted ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center text-xs">
                  {index + 1}
                </span>
              )}
              {language === "PT" ? step.labelPT : step.labelEN}
            </button>
            {index < steps.length - 1 && (
              <div className={cn("w-8 h-0.5", isCompleted ? "bg-chain" : "bg-border")} />
            )}
          </div>
        );
      })}
    </div>
  );
}
