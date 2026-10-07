import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Sparkles, Upload, Layers, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockArchitectureData } from "@/data/architectureContextMock";
import { ArchitectureSettingsModal } from "./ArchitectureSettingsModal";

interface ArchitectureHeaderProps {
  onImportBpmn?: () => void;
  onGenerateAI?: () => void;
  onCreate?: () => void;
  isClientDemo?: boolean;
}

export function ArchitectureHeader({
  onImportBpmn,
  onGenerateAI,
  onCreate,
  isClientDemo,
}: ArchitectureHeaderProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const navigate = useNavigate();
  const [showSettings, setShowSettings] = useState(false);

  // Cálculos globais usando a base de mocks central
  const domainsCount = mockArchitectureData.domainsL1.length;

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-[#FFF3ED] text-[#F97316] flex items-center justify-center shrink-0">
            <Layers className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#272727]">
              {isClientDemo
                ? (pt ? "Arquitetura de Processos · Natura" : "Process Architecture · Natura")
                : (pt ? "Arquitetura de Processos" : "Process Architecture")}
            </h1>
            <p className="text-sm text-[#A5A7B0] mt-0.5">
              {isClientDemo
                ? (pt
                    ? "Mapeamento da cadeia de valor, fluxos de processos operacionais e conexões interfuncionais."
                    : "Value chain mapping, operational process flows, and cross-functional connections.")
                : (pt
                    ? "Mapeie domínios, processos de ponta a ponta e o alinhamento estratégico."
                    : "Map domains, end-to-end processes, and strategic alignment.")}
            </p>
          </div>
        </div>

        {!isClientDemo && (
          <div className="flex flex-wrap items-center gap-3">

            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-[#A5A7B0]/30 text-[#272727] bg-white h-9 px-4 font-medium"
              onClick={onGenerateAI}
            >
              <Sparkles className="h-4 w-4 mr-2 text-[#F97316]" />
              {pt ? "Gerar com IA" : "Generate with AI"}
            </Button>
            
            <Button
              size="sm"
              className="rounded-md bg-[#0F172A] hover:bg-[#1E293B] text-white h-9 px-4 font-medium shadow-sm"
              onClick={onCreate}
            >
              <Plus className="h-4 w-4 mr-2" />
              {pt ? "Criar L1/Domínio" : "Create L1/Domain"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-md border-[#A5A7B0]/30 text-[#F97316] bg-white h-9 w-9 px-0 flex items-center justify-center"
              onClick={() => setShowSettings(true)}
              title={pt ? "Configurações" : "Settings"}
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>


      <ArchitectureSettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </div>
  );
}
