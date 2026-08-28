import { Sparkles, Brain, Search, Lightbulb } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";

const steps = [
  { icon: Search, labelPT: "Analisando contexto da empresa...", labelEN: "Analyzing company context..." },
  { icon: Brain, labelPT: "Identificando oportunidades...", labelEN: "Identifying opportunities..." },
  { icon: Lightbulb, labelPT: "Gerando casos de uso...", labelEN: "Generating use cases..." },
  { icon: Sparkles, labelPT: "Avaliando esforço e impacto...", labelEN: "Evaluating effort & impact..." },
];

export function UseCaseGeneratingScreen() {
  const { language } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      {/* Animated orb */}
      <div className="relative mb-10">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-chain to-chain-dark flex items-center justify-center animate-pulse">
          <Sparkles className="h-10 w-10 text-white" />
        </div>
        <div className="absolute inset-0 h-24 w-24 rounded-full bg-chain/20 animate-ping" />
      </div>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        {language === "PT" ? "Gerando Casos de Uso com IA" : "Generating Use Cases with AI"}
      </h2>
      <p className="text-sm text-muted-foreground mb-10 max-w-md text-center">
        {language === "PT"
          ? "Estamos analisando a cadeia de valor e identificando as melhores oportunidades para sua empresa."
          : "We're analyzing the value chain and identifying the best opportunities for your company."}
      </p>

      {/* Steps */}
      <div className="space-y-3 w-full max-w-sm">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                isActive
                  ? "border-chain bg-chain-surface shadow-sm"
                  : isDone
                  ? "border-border bg-muted/30"
                  : "border-transparent bg-transparent"
              }`}
            >
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive ? "bg-chain text-white" : isDone ? "bg-chain-bg text-chain-dark" : "bg-muted text-muted-foreground"
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className={`text-sm transition-colors ${
                isActive ? "text-foreground font-medium" : isDone ? "text-muted-foreground" : "text-muted-foreground/50"
              }`}>
                {language === "PT" ? step.labelPT : step.labelEN}
              </span>
              {isDone && (
                <span className="ml-auto text-xs text-chain">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
