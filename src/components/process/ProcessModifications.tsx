import { useMemo, useState } from "react";
import { AlertCircle, ChevronRight, Flag, Monitor, Search, UserRound, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSopStore, type SOPStep } from "@/stores/sopStore";

interface ProcessModificationsProps {
  processId: string;
  processName?: string;
  onOpenStep: (stepId: string) => void;
}

const isSpanLayerDemo = (name?: string) => {
  const normalized = name?.toLowerCase() || "";
  return normalized.includes("span") && normalized.includes("layer");
};

const statusStyles: Record<NonNullable<SOPStep["customizationStatus"]>, string> = {
  identified: "bg-amber-50 text-amber-700 border-amber-200",
  monitoring: "bg-blue-50 text-blue-700 border-blue-200",
  validated: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export function ProcessModifications({ processId, processName, onOpenStep }: ProcessModificationsProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const [search, setSearch] = useState("");
  const sopMap = useSopStore((state) => state.sopMap);
  const getSOP = useSopStore((state) => state.getSOP);
  const lookupId = isSpanLayerDemo(processName) ? "span-layer" : processId;
  const sop = sopMap[processId] || sopMap[lookupId] || getSOP(lookupId);

  const customizations = useMemo(
    () => (sop?.steps || []).filter((step) => step.hasSystemCustomization),
    [sop]
  );
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = customizations.filter((step) =>
    !normalizedSearch || [step.title, step.customizationSystem, step.customizationDescription, step.customizationOwner]
      .some((value) => value?.toLowerCase().includes(normalizedSearch))
  );
  const systems = Array.from(new Set(customizations.map((step) => step.customizationSystem).filter(Boolean)));
  const monitoring = customizations.filter((step) => (step.customizationStatus || "identified") !== "validated").length;

  const statusLabel = (status: SOPStep["customizationStatus"]) => {
    if (status === "validated") return pt ? "Validada" : "Validated";
    if (status === "monitoring") return pt ? "Em acompanhamento" : "Monitoring";
    return pt ? "Identificada" : "Identified";
  };

  return (
    <div className="min-h-full bg-background px-8 py-7 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start justify-between gap-6 mb-7">
          <div>
            <div className="flex items-center gap-2 text-violet-700 text-[13px] font-semibold mb-2">
              <Wrench className="h-4 w-4" />
              {pt ? "Acompanhamento técnico" : "Technical tracking"}
            </div>
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              {pt ? "Modificações de sistemas" : "System modifications"}
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              {pt
                ? "Visão consolidada das personalizações identificadas nos steps desta SOP."
                : "Consolidated view of customizations identified in this SOP's steps."}
            </p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} className="pl-9 bg-card" placeholder={pt ? "Buscar sistema ou step..." : "Search system or step..."} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-7">
          <Metric icon={<Flag className="h-5 w-5" />} value={customizations.length} label={pt ? "modificações no processo" : "process modifications"} tone="violet" />
          <Metric icon={<Monitor className="h-5 w-5" />} value={systems.length} label={pt ? "sistemas modificados" : "modified systems"} tone="blue" />
          <Metric icon={<AlertCircle className="h-5 w-5" />} value={monitoring} label={pt ? "itens a acompanhar" : "items to track"} tone="amber" />
        </div>

        {customizations.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-xl py-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Flag className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="font-semibold text-foreground mb-1">{pt ? "Nenhuma modificação mapeada" : "No modifications mapped"}</h2>
            <p className="text-sm text-muted-foreground">{pt ? "Edite a SOP e ative a flag de personalização nos steps aplicáveis." : "Edit the SOP and enable the customization flag on applicable steps."}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[15px] font-semibold text-foreground">{pt ? "Steps impactados" : "Impacted steps"}</h2>
              <span className="text-[12px] text-muted-foreground">{filtered.length} {pt ? "resultado(s)" : "result(s)"}</span>
            </div>
            {filtered.map((step) => {
              const status = step.customizationStatus || "identified";
              return (
                <button key={step.id} onClick={() => onOpenStep(step.id)} className="w-full bg-card border border-border rounded-xl p-5 text-left hover:border-violet-300 hover:shadow-sm transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0">
                      <Flag className="h-4 w-4 fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[12px] font-semibold text-violet-700">STEP {step.id}</span>
                        <span className={cn("inline-flex px-2 py-0.5 rounded-full border text-[11px] font-medium", statusStyles[status])}>{statusLabel(status)}</span>
                      </div>
                      <h3 className="text-[16px] font-semibold text-foreground mb-2">{step.title}</h3>
                      <p className="text-[13px] leading-relaxed text-muted-foreground mb-3">{step.customizationDescription || (pt ? "Descrição ainda não informada." : "Description not provided yet.")}</p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
                        <span className="inline-flex items-center gap-1.5 text-foreground"><Monitor className="h-3.5 w-3.5 text-muted-foreground" />{step.customizationSystem || step.system || (pt ? "Sistema não informado" : "System not provided")}</span>
                        <span className="inline-flex items-center gap-1.5 text-foreground"><UserRound className="h-3.5 w-3.5 text-muted-foreground" />{step.customizationOwner || (pt ? "Responsável não informado" : "Owner not provided")}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-violet-700 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">{pt ? "Nenhuma modificação corresponde à busca." : "No modification matches your search."}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon, value, label, tone }: { icon: React.ReactNode; value: number; label: string; tone: "violet" | "blue" | "amber" }) {
  const tones = {
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-3">
      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", tones[tone])}>{icon}</div>
      <div><div className="text-xl font-semibold text-foreground leading-none mb-1">{value}</div><div className="text-[12px] text-muted-foreground">{label}</div></div>
    </div>
  );
}
