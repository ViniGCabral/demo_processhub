import { User, Monitor, Timer, Hourglass, Plus, X, Cpu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import type { SOPStep, SOPAutomationClass } from "@/stores/sopStore";

export const AUTOMATION_CLASSES: Record<
  SOPAutomationClass,
  { pt: string; en: string; className: string }
> = {
  ME: { pt: "Manual Estruturado", en: "Structured Manual", className: "bg-slate-100 text-slate-700" },
  MS: { pt: "Manual Semi-Estruturado", en: "Semi-Structured Manual", className: "bg-amber-50 text-amber-700" },
  MA: { pt: "Manual Analítico", en: "Analytical Manual", className: "bg-orange-50 text-orange-700" },
  SA: { pt: "Semi-Automatizado", en: "Semi-Automated", className: "bg-sky-50 text-sky-700" },
  AU: { pt: "Automatizado", en: "Automated", className: "bg-emerald-50 text-emerald-700" },
  MNA: { pt: "Manual Não-Automatizável", en: "Non-Automatable Manual", className: "bg-red-50 text-red-700" },
};

interface StepMicroAttributesProps {
  step: SOPStep;
  isEditMode: boolean;
  onChange: (field: keyof SOPStep, value: string | boolean | undefined) => void;
}

export function StepMicroAttributes({ step, isEditMode, onChange }: StepMicroAttributesProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const cls = step.automationClass ? AUTOMATION_CLASSES[step.automationClass] : undefined;
  const showWait = step.hasWaitTime || !!step.waitTime;

  if (!isEditMode) {
    const hasAny = step.executor || step.system || cls || step.executionTime || step.waitTime;
    if (!hasAny) return null;
    return (
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 mt-2">
        {step.executor && <Chip icon={<User className="h-3 w-3" />} value={step.executor} />}
        {step.system && <Chip icon={<Monitor className="h-3 w-3" />} value={step.system} />}
        {cls && (
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium",
              cls.className
            )}
          >
            <Cpu className="h-3 w-3" />
            {pt ? cls.pt : cls.en}
          </span>
        )}
        {step.executionTime && <Chip icon={<Timer className="h-3 w-3" />} value={step.executionTime} />}
        {step.waitTime && (
          <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium bg-[#FEF3C7] text-[#92400E]">
            <Hourglass className="h-3 w-3" />
            {pt ? "Espera" : "Wait"}: {step.waitTime}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 bg-surface-subtle border border-border rounded-lg p-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label={pt ? "Quem executa" : "Executor"}>
          <Input
            value={step.executor || ""}
            onChange={(e) => onChange("executor", e.target.value)}
            placeholder={pt ? "Ex: Analista de People" : "Ex: People Analyst"}
            className="h-8 text-[13px] bg-card"
          />
        </Field>
        <Field label={pt ? "Sistema" : "System"}>
          <Input
            value={step.system || ""}
            onChange={(e) => onChange("system", e.target.value)}
            placeholder={pt ? "Ex: Workday" : "Ex: Workday"}
            className="h-8 text-[13px] bg-card"
          />
        </Field>
        <Field label={pt ? "Classificação de automação" : "Automation class"}>
          <select
            value={step.automationClass || ""}
            onChange={(e) => onChange("automationClass", e.target.value || undefined)}
            className="w-full h-8 px-2 bg-card border border-input rounded-md text-[13px] text-foreground"
          >
            <option value="">{pt ? "Não definido" : "Not defined"}</option>
            {(Object.keys(AUTOMATION_CLASSES) as SOPAutomationClass[]).map((key) => (
              <option key={key} value={key}>
                {pt ? AUTOMATION_CLASSES[key].pt : AUTOMATION_CLASSES[key].en}
              </option>
            ))}
          </select>
        </Field>
        <Field label={pt ? "Tempo de execução" : "Execution time"}>
          <Input
            value={step.executionTime || ""}
            onChange={(e) => onChange("executionTime", e.target.value)}
            placeholder={pt ? "Ex: 45 min" : "Ex: 45 min"}
            className="h-8 text-[13px] bg-card"
          />
        </Field>
      </div>

      {showWait ? (
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-medium uppercase tracking-[0.3px] text-muted-foreground">
              {pt ? "Tempo médio de espera / retorno" : "Average wait / response time"}
            </label>
            <button
              onClick={() => {
                onChange("waitTime", "");
                onChange("hasWaitTime", false);
              }}
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
              {pt ? "Remover campo" : "Remove field"}
            </button>
          </div>
          <Input
            value={step.waitTime || ""}
            onChange={(e) => onChange("waitTime", e.target.value)}
            placeholder={pt ? "Ex: 48h para retorno do validador" : "Ex: 48h for validator response"}
            className="h-8 text-[13px] bg-card"
          />
        </div>
      ) : (
        <button
          onClick={() => onChange("hasWaitTime", true)}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-primary transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          {pt ? "Adicionar tempo de espera (validação / contato externo)" : "Add wait time (validation / external contact)"}
        </button>
      )}
    </div>
  );
}

function Chip({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded text-[11px] font-medium bg-muted text-muted-foreground">
      {icon}
      {value}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[11px] font-medium uppercase tracking-[0.3px] text-muted-foreground mb-1 block">
        {label}
      </label>
      {children}
    </div>
  );
}
