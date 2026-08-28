import { useState } from "react";
import { Search, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { UseCase, useUseCaseStore } from "@/stores/useCaseStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ScreenMatchSection({ useCase }: { useCase: UseCase }) {
  const { language } = useLanguage();
  const { updateUseCase } = useUseCaseStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasData = !!useCase.screen_match;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-screen-match", {
        body: { use_case_id: useCase.id, title: useCase.title, description: useCase.description, key_technologies: useCase.key_technologies },
      });
      if (error) throw error;
      updateUseCase(useCase.id, { screen_match: data.solutions });
      setIsOpen(true);
      toast.success(language === "PT" ? "Soluções encontradas!" : "Solutions found!");
    } catch {
      toast.error(language === "PT" ? "Erro ao buscar soluções" : "Error finding solutions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between p-5 text-left"
        onClick={() => hasData && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-purple-100 flex items-center justify-center">
            <Search className="h-5 w-5 text-purple-700" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Screen & Match</h3>
            <p className="text-xs text-muted-foreground">
              {language === "PT" ? "Encontre soluções prontas no mercado" : "Find ready-made solutions in the market"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasData ? (
            <Button size="sm" className="gap-1.5 bg-chain hover:bg-chain-dark text-white" onClick={(e) => { e.stopPropagation(); handleGenerate(); }} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {language === "PT" ? "Buscar Soluções" : "Find Solutions"}
            </Button>
          ) : (
            isOpen ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </button>

      {isOpen && hasData && (
        <div className="px-5 pb-5 border-t border-border pt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">Vendor</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{language === "PT" ? "Solução" : "Solution"}</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{language === "PT" ? "Tipo" : "Type"}</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{language === "PT" ? "Diferenciais" : "Differentials"}</th>
                <th className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{language === "PT" ? "Preço" : "Pricing"}</th>
              </tr>
            </thead>
            <tbody>
              {(useCase.screen_match as any[]).map((sol: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2.5 px-3 font-medium text-foreground">{sol.vendor}</td>
                  <td className="py-2.5 px-3 text-foreground">{sol.solution}</td>
                  <td className="py-2.5 px-3"><Badge variant="secondary" className="text-[10px]">{sol.type}</Badge></td>
                  <td className="py-2.5 px-3 text-muted-foreground text-xs">{sol.differentials}</td>
                  <td className="py-2.5 px-3 text-xs text-muted-foreground">{sol.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
