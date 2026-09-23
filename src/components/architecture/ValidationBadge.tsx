import { useState } from "react";
import { ValidatableString, ValidationState } from "@/types/architectureContextTypes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, AlertCircle, HelpCircle, ShieldCheck, Cpu } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface ValidationBadgeProps {
  item: ValidatableString;
  className?: string;
}

export function ValidationBadge({ item, className }: ValidationBadgeProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  
  // Local state to simulate prototyping actions
  const [currentValidation, setCurrentValidation] = useState(item.validation);
  
  const getStateInfo = (state: ValidationState) => {
    switch (state) {
      case 'confirmado': return { color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle2, label: pt ? 'Confirmado' : 'Confirmed' };
      case 'sugerido_ia': return { color: 'text-purple-600 bg-purple-50 border-purple-200', icon: Cpu, label: pt ? 'Sugerido por IA' : 'AI Suggested' };
      case 'rejeitado': return { color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle, label: pt ? 'Rejeitado' : 'Rejected' };
      case 'contraditorio': return { color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertCircle, label: pt ? 'Contraditório' : 'Contradictory' };
      case 'em_validacao': return { color: 'text-blue-600 bg-blue-50 border-blue-200', icon: HelpCircle, label: pt ? 'Em Validação' : 'Validating' };
      default: return { color: 'text-gray-600 bg-gray-50 border-gray-200', icon: ShieldCheck, label: state.replace('_', ' ') };
    }
  };

  const info = getStateInfo(currentValidation.state);
  const Icon = info.icon;

  const handleAction = (newState: ValidationState) => {
    setCurrentValidation({
      ...currentValidation,
      state: newState,
      responsible: 'Você (Protótipo)',
      date: new Date().toISOString().split('T')[0],
      justification: pt ? 'Ação manual via interface' : 'Manual action via interface'
    });
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="text-[#272727]">{item.value}</span>
      
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn("inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-sm border font-medium cursor-pointer transition-colors hover:brightness-95", info.color)}>
            <Icon className="h-3 w-3" />
            {info.label}
          </button>
        </PopoverTrigger>
        
        <PopoverContent className="w-80 p-4" align="start">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Icon className={cn("h-4 w-4", info.color.split(' ')[0])} />
              <h4 className="font-semibold text-sm">{info.label}</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">{pt ? "Origem" : "Origin"}</span>
                <span className="font-semibold">{currentValidation.origin}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">{pt ? "Confiança" : "Confidence"}</span>
                <span className="font-semibold">{currentValidation.confidence}%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">{pt ? "Data" : "Date"}</span>
                <span>{currentValidation.date}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 font-medium">{pt ? "Responsável" : "Responsible"}</span>
                <span className="truncate" title={currentValidation.responsible}>{currentValidation.responsible}</span>
              </div>
            </div>
            
            <div className="flex flex-col text-xs bg-gray-50 p-2 rounded-sm border">
              <span className="text-gray-500 font-medium mb-1">{pt ? "Justificativa/Evidência" : "Justification/Evidence"}</span>
              <span className="italic">{currentValidation.justification}</span>
            </div>

            <div className="flex gap-2 pt-2 border-t mt-2">
              {currentValidation.state !== 'confirmado' && (
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-green-200 text-green-700 hover:bg-green-50" onClick={() => handleAction('confirmado')}>
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {pt ? "Confirmar" : "Confirm"}
                </Button>
              )}
              {currentValidation.state !== 'rejeitado' && (
                <Button size="sm" variant="outline" className="flex-1 text-xs h-7 border-red-200 text-red-700 hover:bg-red-50" onClick={() => handleAction('rejeitado')}>
                  <XCircle className="h-3 w-3 mr-1" />
                  {pt ? "Rejeitar" : "Reject"}
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
