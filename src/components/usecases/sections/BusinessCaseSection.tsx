import { useState } from "react";
import { DollarSign, Loader2, Sparkles, TrendingDown, Clock, DollarSignIcon, BarChart3, TrendingUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { UseCase, useUseCaseStore } from "@/stores/useCaseStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Premises {
  capex: string;
  opex_monthly: string;
  wacc: string;
  horizon_years: string;
  ramp_up_months: string;
  annual_saving: string;
}

interface BusinessCaseResult {
  roi: number;
  payback: number;
  npv: number;
  benefit_to_cost: number;
  total_investment: number;
  net_benefit: number;
  annual_savings: number;
  discount_rate: number;
}

function calculateBusinessCase(p: Premises): BusinessCaseResult {
  const capex = parseFloat(p.capex) || 0;
  const opexMonthly = parseFloat(p.opex_monthly) || 0;
  const wacc = (parseFloat(p.wacc) || 10) / 100;
  const horizon = parseInt(p.horizon_years) || 5;
  const rampUp = parseInt(p.ramp_up_months) || 0;
  const annualSaving = parseFloat(p.annual_saving) || 0;

  const totalOpex = opexMonthly * 12 * horizon;
  const totalInvestment = capex + totalOpex;

  // NPV calculation
  let npv = -capex;
  for (let year = 1; year <= horizon; year++) {
    const netCashFlow = annualSaving - (opexMonthly * 12);
    // Adjust first year for ramp-up
    const adjustedCF = year === 1 && rampUp > 0
      ? netCashFlow * ((12 - rampUp) / 12)
      : netCashFlow;
    npv += adjustedCF / Math.pow(1 + wacc, year);
  }

  const totalBenefit = annualSaving * horizon;
  const roi = totalInvestment > 0 ? ((totalBenefit - totalInvestment) / totalInvestment) * 100 : 0;
  const monthlySaving = annualSaving / 12;
  const monthlyNet = monthlySaving - opexMonthly;
  const payback = monthlyNet > 0 ? capex / monthlyNet : horizon * 12;
  const benefitToCost = totalInvestment > 0 ? totalBenefit / totalInvestment : 0;
  const netBenefit = totalBenefit - totalInvestment;

  return {
    roi: Math.round(roi * 100) / 100,
    payback: Math.round(payback * 10) / 10,
    npv: Math.round(npv),
    benefit_to_cost: Math.round(benefitToCost * 100) / 100,
    total_investment: Math.round(totalInvestment),
    net_benefit: Math.round(netBenefit),
    annual_savings: Math.round(annualSaving),
    discount_rate: parseFloat(p.wacc) || 10,
  };
}

function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("pt-BR");
  return value < 0 ? `R$ -${formatted}` : `R$ ${formatted}`;
}

export function BusinessCaseSection({ useCase }: { useCase: UseCase }) {
  const { language } = useLanguage();
  const { updateUseCase } = useUseCaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isEstimating, setIsEstimating] = useState(false);
  const [result, setResult] = useState<BusinessCaseResult | null>(
    useCase.business_case ? useCase.business_case as any : null
  );

  const [premises, setPremises] = useState<Premises>({
    capex: "",
    opex_monthly: "",
    wacc: "10",
    horizon_years: "5",
    ramp_up_months: "3",
    annual_saving: "",
  });

  const updateField = (key: keyof Premises, value: string) => {
    setPremises((prev) => ({ ...prev, [key]: value }));
  };

  const handleEstimateWithAI = async () => {
    setIsEstimating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-business-case", {
        body: {
          use_case_id: useCase.id,
          title: useCase.title,
          description: useCase.description,
          mode: "estimate",
        },
      });
      if (error) throw error;
      const est = data.estimates;
      if (est) {
        setPremises({
          capex: String(est.capex ?? ""),
          opex_monthly: String(est.opex_monthly ?? ""),
          wacc: String(est.wacc ?? "10"),
          horizon_years: String(est.horizon_years ?? "5"),
          ramp_up_months: String(est.ramp_up_months ?? "3"),
          annual_saving: String(est.annual_saving ?? ""),
        });
        toast.success(language === "PT" ? "Estimativas geradas com IA!" : "AI estimates generated!");
      }
    } catch {
      toast.error(language === "PT" ? "Erro ao gerar estimativas" : "Error generating estimates");
    } finally {
      setIsEstimating(false);
    }
  };

  const handleCalculate = () => {
    const bc = calculateBusinessCase(premises);
    setResult(bc);
    updateUseCase(useCase.id, { business_case: bc as any });
    toast.success(language === "PT" ? "Business case calculado!" : "Business case calculated!");
  };

  const fields: { key: keyof Premises; label: string }[] = [
    { key: "capex", label: "Investment (CAPEX)" },
    { key: "opex_monthly", label: "Monthly Cost (OPEX)" },
    { key: "wacc", label: "WACC / Discount Rate (%)" },
    { key: "horizon_years", label: language === "PT" ? "Horizonte (anos)" : "Horizon (years)" },
    { key: "ramp_up_months", label: "Ramp-up (months)" },
    { key: "annual_saving", label: "Estimated Annual Saving" },
  ];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Business Case</h3>
            <p className="text-xs text-muted-foreground">{useCase.title}</p>
          </div>
        </div>
        <div className="text-muted-foreground">
          {isOpen ? "▲" : "▼"}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-5 border-t border-border pt-4 space-y-6">
          <Separator />

          {/* Financial Premises */}
          <div className="border border-border rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">
                {language === "PT" ? "Premissas Financeiras" : "Financial Premises"}
              </h4>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs"
                onClick={handleEstimateWithAI}
                disabled={isEstimating}
              >
                {isEstimating ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-violet-500" />
                )}
                {language === "PT" ? "Gerar estimativa com IA" : "Generate estimate with AI"}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <p className="text-xs font-medium text-chain mb-1.5">{field.label}</p>
                  <Input
                    type="number"
                    value={premises[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="h-10 bg-background"
                    placeholder="—"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCalculate}
                className="gap-1.5 bg-chain hover:bg-chain-dark text-white"
              >
                <Calculator className="h-4 w-4" />
                {language === "PT" ? "Calcular Business Case" : "Calculate Business Case"}
              </Button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <>
              {/* Metric cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="border-l-4 border-chain rounded-xl bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">ROI</span>
                    <TrendingDown className={cn("h-4 w-4", result.roi >= 0 ? "text-emerald-500" : "text-red-500")} />
                  </div>
                  <p className={cn("text-2xl font-bold", result.roi >= 0 ? "text-emerald-600" : "text-red-500")}>
                    {result.roi}%
                  </p>
                </div>

                <div className="border-l-4 border-chain rounded-xl bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">Payback</span>
                    <Clock className="h-4 w-4 text-chain" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{result.payback}</p>
                  <p className="text-xs text-muted-foreground">{language === "PT" ? "meses" : "months"}</p>
                </div>

                <div className="border-l-4 border-chain rounded-xl bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">NPV</span>
                    <DollarSignIcon className="h-4 w-4 text-chain" />
                  </div>
                  <p className={cn("text-2xl font-bold", result.npv >= 0 ? "text-emerald-600" : "text-red-500")}>
                    {formatCurrency(result.npv)}
                  </p>
                </div>

                <div className="border-l-4 border-chain rounded-xl bg-background p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground font-medium">Benefit-to-Cost</span>
                    <BarChart3 className="h-4 w-4 text-chain" />
                  </div>
                  <p className={cn("text-2xl font-bold", result.benefit_to_cost >= 1 ? "text-emerald-600" : "text-red-500")}>
                    {result.benefit_to_cost}x
                  </p>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="border-l-4 border-emerald-400 rounded-xl bg-background p-5">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  Executive Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 text-sm">
                  <div>
                    <p className="text-chain text-xs font-medium">Total Investment</p>
                    <p className="font-semibold text-foreground">{formatCurrency(result.total_investment)}</p>
                  </div>
                  <div>
                    <p className="text-chain text-xs font-medium">
                      Net Benefit ({premises.horizon_years} {language === "PT" ? "anos" : "years"})
                    </p>
                    <p className="font-semibold text-foreground">{formatCurrency(result.net_benefit)}</p>
                  </div>
                  <div>
                    <p className="text-chain text-xs font-medium">Annual Savings</p>
                    <p className="font-semibold text-foreground">{formatCurrency(result.annual_savings)}</p>
                  </div>
                  <div>
                    <p className="text-chain text-xs font-medium">Discount Rate</p>
                    <p className="font-semibold text-foreground">{result.discount_rate}%</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
