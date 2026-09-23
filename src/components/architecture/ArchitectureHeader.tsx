import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Sparkles, Upload, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockArchitectureData } from "@/data/architectureContextMock";

interface ArchitectureHeaderProps {
  onImportBpmn?: () => void;
  onGenerateAI?: () => void;
  onCreate?: () => void;
}

export function ArchitectureHeader({
  onImportBpmn,
  onGenerateAI,
  onCreate,
}: ArchitectureHeaderProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const navigate = useNavigate();

  // Cálculos globais usando a base de mocks central
  const domainsCount = mockArchitectureData.domainsL1.length;

  return (
    <div className="mb-6 bg-white border border-[#A5A7B0]/20 rounded-md p-5 shadow-sm">
      {/* Breadcrumb & Top Actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
        <div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm mb-3 transition-colors hover:text-[#0C1BA8] text-[#A5A7B0]"
          >
            <ChevronLeft className="h-4 w-4" />
            {pt ? "Voltar para a tela inicial" : "Back to Home"}
          </button>
          
          <h1 className="text-2xl font-bold text-[#272727]">
            {pt ? "Arquitetura de Processos" : "Process Architecture"}
          </h1>
          <p className="text-sm text-[#A5A7B0] mt-1">
            {pt
              ? "Mapeie domínios, processos de ponta a ponta e o alinhamento estratégico."
              : "Map domains, end-to-end processes, and strategic alignment."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm border-[#A5A7B0]/40 text-[#272727]"
            onClick={onImportBpmn}
          >
            <Upload className="h-4 w-4 mr-2" />
            {pt ? "Importar BPMN" : "Import BPMN"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm border-[#A5A7B0]/40 text-[#272727]"
            onClick={onGenerateAI}
          >
            <Sparkles className="h-4 w-4 mr-2 text-[#0C1BA8]" />
            {pt ? "Gerar com IA" : "Generate with AI"}
          </Button>
          
          <Button
            size="sm"
            className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
            onClick={onCreate}
          >
            <Plus className="h-4 w-4 mr-2" />
            {pt ? "Criar L1/Domínio" : "Create L1/Domain"}
          </Button>
        </div>
      </div>

      {/* Faixa de Indicadores */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-t border-[#A5A7B0]/20 pt-4">
        <div className="flex items-center gap-1 p-1 bg-[#f3f4f6] rounded-md w-fit">
          <div className="flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 bg-white text-[#0C1BA8] shadow-sm">
            <Layers className="h-4 w-4" />
            {pt ? "Cadeia de Valor" : "Value Chain"}
          </div>
        </div>

        {/* Indicadores Globais */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex flex-col items-end">
            <span className="text-[#A5A7B0] text-[11px] font-medium uppercase tracking-wide">
              {pt ? "Domínios L1" : "L1 Domains"}
            </span>
            <span className="text-[#272727] font-bold text-lg leading-tight">
              {domainsCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
