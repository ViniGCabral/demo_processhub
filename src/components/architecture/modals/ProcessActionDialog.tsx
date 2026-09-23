import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProcessData } from "@/stores/processStore";
import {
  FileText,
  GitFork,
  Route,
  ArrowRight,
  Sparkles,
  Building2,
  User,
  Layers,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ProcessActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  process: ProcessData | null;
  onViewDetail: (processId: string) => void;
  onViewConnectionMap: (process: ProcessData) => void;
  onViewConnectionMap: (process: ProcessData) => void;
}

export function ProcessActionDialog({
  open,
  onOpenChange,
  process,
  onViewDetail,
  onViewConnectionMap,
}: ProcessActionDialogProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  if (!process) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white border border-gray-200 shadow-2xl rounded-xl">
        {/* Header com Identificação do Processo */}
        <div className="bg-gradient-to-br from-[#0C1BA8]/5 via-white to-gray-50 p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Badge className="bg-[#0C1BA8] text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded">
              L4 · {pt ? "Processo" : "Process"}
            </Badge>
            {process.l1 && (
              <Badge variant="outline" className="border-gray-200 text-gray-700 text-[10px] bg-white">
                <Building2 className="w-3 h-3 mr-1 text-[#0C1BA8]" />
                {process.l1}
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`text-[10px] ${
                process.hasDocumentation
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200"
              }`}
            >
              {process.hasDocumentation ? (
                <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" />
              ) : (
                <Clock className="w-3 h-3 mr-1 text-amber-600 inline" />
              )}
              {process.hasDocumentation
                ? pt ? "Documentado" : "Documented"
                : pt ? "Pendente" : "Pending"}
            </Badge>
          </div>

          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg font-bold text-[#272727] leading-snug">
              {process.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500 line-clamp-2">
              {process.description || (pt ? "Processo operacional da cadeia de valor." : "Operational value chain process.")}
            </DialogDescription>
          </DialogHeader>

          {/* Metadados rápidos */}
          {(process.owner || (process.systems && process.systems.length > 0)) && (
            <div className="mt-3 pt-3 border-t border-gray-200/60 flex items-center gap-4 text-[11px] text-gray-600 flex-wrap">
              {process.owner && (
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#0C1BA8]" />
                  <span className="font-medium text-gray-500">{pt ? "Responsável:" : "Owner:"}</span>
                  <span className="font-semibold text-gray-800">{process.owner}</span>
                </div>
              )}
              {process.systems && process.systems.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#0C1BA8]" />
                  <span className="font-medium text-gray-500">{pt ? "Sistemas:" : "Systems:"}</span>
                  <span className="font-semibold text-gray-800">{process.systems.join(", ")}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Corpo: Escolha da Ação */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
            {pt ? "O que você deseja visualizar?" : "What would you like to view?"}
          </p>

          {/* Opção 1: Detalhamento do Processo */}
          <button
            type="button"
            onClick={() => onViewDetail(process.id)}
            className="w-full text-left p-3.5 rounded-lg border border-gray-200 hover:border-[#0C1BA8] hover:bg-blue-50/30 transition-all group flex items-start gap-3.5 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0C1BA8]/10 text-[#0C1BA8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#272727] group-hover:text-[#0C1BA8] transition-colors">
                  {pt ? "Ver detalhamento do processo" : "View process details"}
                </h4>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#0C1BA8] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                {pt
                  ? "Acesse a documentação completa, fluxo operacional, SIPOC, sistemas, indicadores e governança deste processo."
                  : "Access full documentation, operational flow, SIPOC, systems, indicators, and governance."}
              </p>
            </div>
          </button>

          {/* Opção 2: Mapa de Predecessores e Sucessores */}
          <button
            type="button"
            onClick={() => onViewConnectionMap(process)}
            className="w-full text-left p-3.5 rounded-lg border-2 border-[#0C1BA8]/30 bg-gradient-to-r from-blue-50/40 to-indigo-50/20 hover:border-[#0C1BA8] hover:bg-blue-50/60 transition-all group flex items-start gap-3.5 cursor-pointer shadow-2xs"
          >
            <div className="w-10 h-10 rounded-lg bg-[#0C1BA8] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-xs">
              <GitFork className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-[#0C1BA8]">
                    {pt ? "Ver mapa de predecessores e sucessores" : "View predecessor & successor map"}
                  </h4>
                  <Badge className="bg-[#0C1BA8]/10 text-[#0C1BA8] border-0 text-[9px] font-semibold">
                    {pt ? "Interativo" : "Interactive"}
                  </Badge>
                </div>
                <ArrowRight className="w-4 h-4 text-[#0C1BA8] group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                {pt
                  ? "Visualize handoffs, insumos recebidos, disparos de execução e entregas para os processos seguintes."
                  : "Explore handoffs, received inputs, execution triggers, and outputs delivered to next processes."}
              </p>
            </div>
          </button>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs text-gray-600 border-gray-300 hover:bg-white"
          >
            {pt ? "Cancelar" : "Cancel"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
