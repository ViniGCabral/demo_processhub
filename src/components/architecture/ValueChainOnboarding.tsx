import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy, TaxonomyLevel } from "@/stores/taxonomyStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layers, Sparkles, ArrowRight, Building2 } from "lucide-react";

interface ValueChainOnboardingProps {
  onCreateFromScratch: () => void;
  onGenerateWithAI: (companyName: string) => void;
}

export function ValueChainOnboarding({
  onCreateFromScratch,
  onGenerateWithAI,
}: ValueChainOnboardingProps) {
  const { language } = useLanguage();
  const { label: lvl, maxLevel } = useTaxonomy();
  const levelNames = Array.from({ length: maxLevel }, (_, i) => lvl(`l${i + 1}` as TaxonomyLevel));
  const [showAIForm, setShowAIForm] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateWithAI = async () => {
    if (!companyName.trim()) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onGenerateWithAI(companyName.trim());
    setIsGenerating(false);
  };

  if (showAIForm) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#c9dcf2] rounded-sm flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#0C1BA8]" />
            </div>
            <h2 className="text-2xl font-semibold text-[#272727] mb-2">
              {language === "PT"
                ? "Gerar Cadeia de Valor com IA"
                : "Generate Value Chain with AI"}
            </h2>
            <p className="text-[#A5A7B0]">
              {language === "PT"
                ? "Insira o nome da sua empresa e nossa IA irá gerar uma proposta de cadeia de valor personalizada."
                : "Enter your company name and our AI will generate a personalized value chain proposal."}
            </p>
          </div>

          <div className="bg-white border border-[#A5A7B0]/30 rounded-sm p-6 space-y-4">
            <div>
              <Label htmlFor="companyName" className="flex items-center gap-2 mb-2 text-[#272727]">
                <Building2 className="w-4 h-4" />
                {language === "PT" ? "Nome da Empresa" : "Company Name"}
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={
                  language === "PT"
                    ? "Ex: Acme Corporation"
                    : "e.g., Acme Corporation"
                }
                className="text-lg rounded-sm"
                autoFocus
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1 rounded-sm border-[#A5A7B0]/30"
                onClick={() => setShowAIForm(false)}
              >
                {language === "PT" ? "Voltar" : "Back"}
              </Button>
              <Button
                className="flex-1 rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                onClick={handleGenerateWithAI}
                disabled={!companyName.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    {language === "PT" ? "Gerando..." : "Generating..."}
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {language === "PT" ? "Gerar Cadeia" : "Generate Chain"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-[#c9dcf2] rounded-sm flex items-center justify-center mx-auto mb-6">
          <Layers className="w-10 h-10 text-[#0C1BA8]" />
        </div>
        <h2 className="text-3xl font-semibold text-[#272727] mb-3">
          {language === "PT"
            ? "Bem-vindo à Cadeia de Valor"
            : "Welcome to Value Chain"}
        </h2>
        <p className="text-lg text-[#A5A7B0] mb-10 max-w-md mx-auto">
          {language === "PT"
            ? "Comece a mapear os processos da sua organização. Escolha como deseja começar:"
            : "Start mapping your organization's processes. Choose how you'd like to begin:"}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Create from scratch */}
          <button
            onClick={onCreateFromScratch}
            className="group bg-white border border-[#A5A7B0]/30 rounded-sm p-8 text-left transition-all hover:border-[#0C1BA8] hover:shadow-sm"
          >
            <div className="w-12 h-12 bg-[#f9f9f9] rounded-sm flex items-center justify-center mb-4 group-hover:bg-[#c9dcf2] transition-colors">
              <Layers className="w-6 h-6 text-[#A5A7B0] group-hover:text-[#0C1BA8] transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-[#272727] mb-2">
              {language === "PT" ? "Criar do Zero" : "Create from Scratch"}
            </h3>
            <p className="text-[#A5A7B0] mb-4">
              {language === "PT"
                ? `Crie sua própria estrutura de cadeia de valor manualmente, adicionando ${levelNames.join(", ")} conforme necessário.`
                : `Create your own value chain structure manually, adding ${levelNames.join(", ")} as needed.`}
            </p>
            <span className="inline-flex items-center text-[#0C1BA8] font-medium group-hover:gap-2 transition-all">
              {language === "PT" ? "Começar" : "Get Started"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </span>
          </button>

          {/* Option 2: Generate with AI */}
          <button
            onClick={() => setShowAIForm(true)}
            className="group bg-white border border-[#A5A7B0]/30 rounded-sm p-8 text-left transition-all hover:border-[#0C1BA8] hover:shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 bg-[#0C1BA8] text-white text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-sm">
              {language === "PT" ? "Recomendado" : "Recommended"}
            </div>
            <div className="w-12 h-12 bg-[#f9f9f9] rounded-sm flex items-center justify-center mb-4 group-hover:bg-[#c9dcf2] transition-colors">
              <Sparkles className="w-6 h-6 text-[#A5A7B0] group-hover:text-[#0C1BA8] transition-colors" />
            </div>
            <h3 className="text-xl font-semibold text-[#272727] mb-2">
              {language === "PT" ? "Gerar com IA" : "Generate with AI"}
            </h3>
            <p className="text-[#A5A7B0] mb-4">
              {language === "PT"
                ? "Deixe nossa IA criar uma proposta de cadeia de valor baseada no nome e setor da sua empresa."
                : "Let our AI create a value chain proposal based on your company's name and industry."}
            </p>
            <span className="inline-flex items-center text-[#0C1BA8] font-medium group-hover:gap-2 transition-all">
              {language === "PT" ? "Usar IA" : "Use AI"}
              <Sparkles className="w-4 h-4 ml-1" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
