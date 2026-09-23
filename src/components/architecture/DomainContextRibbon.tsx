import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  FileText, CheckCircle2, Monitor, Route, TrendingUp, Boxes, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DomainContextRibbonProps {
  domainName: string;
  domainCategory?: "PRIMARY" | "SUPPORT" | string;
  totalProcesses: number;
  docPercent: number;
  contextPercent: number;
  journeysCount: number;
  systemsCount: number;
  mainKpiName?: string;
  mainKpiValue?: string;
  variant?: "full" | "compact";
  subLevelTitle?: string;
  onNavigateToDomain?: () => void;
  className?: string;
}

export function DomainContextRibbon({
  domainName,
  domainCategory = "PRIMARY",
  totalProcesses,
  docPercent,
  contextPercent,
  journeysCount,
  systemsCount,
  mainKpiName = "SLA Principal",
  mainKpiValue = "92%",
  variant = "full",
  subLevelTitle,
  onNavigateToDomain,
  className,
}: DomainContextRibbonProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  if (variant === "compact") {
    return (
      <div className={cn(
        "bg-white border border-[#A5A7B0]/25 rounded-md px-4 py-2.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs mb-4",
        className
      )}>
        {/* Left: Domain Identification */}
        <div className="flex items-center gap-2">
          <button 
            onClick={onNavigateToDomain}
            className="flex items-center gap-1.5 font-bold text-[#0C1BA8] hover:underline cursor-pointer"
            title={pt ? "Voltar ao Panorama do Domínio" : "Back to Domain Overview"}
          >
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-sm bg-[#0C1BA8]/10 uppercase tracking-wide">
              {pt ? "Domínio" : "Domain"}
            </span>
            <span className="text-sm font-bold text-[#272727] hover:text-[#0C1BA8]">{domainName}</span>
          </button>

          {subLevelTitle && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0]" />
              <span className="font-semibold text-[#272727] bg-gray-100 px-2 py-0.5 rounded text-xs">
                {subLevelTitle}
              </span>
            </>
          )}
        </div>

        {/* Right: Metrics Pills */}
        <div className="flex flex-wrap items-center gap-4 text-[#6B7280]">
          <div className="flex items-center gap-1.5">
            <Boxes className="h-3.5 w-3.5 text-[#0C1BA8]" />
            <span>{pt ? "Processos" : "Processes"}: <strong className="text-[#272727]">{totalProcesses}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-600" />
            <span>{pt ? "Doc" : "Docs"}: <strong className="text-[#272727]">{docPercent}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>{pt ? "Contexto" : "Context"}: <strong className="text-[#272727]">{contextPercent}%</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Route className="h-3.5 w-3.5 text-purple-600" />
            <span>{pt ? "Jornadas" : "Journeys"}: <strong className="text-[#272727]">{journeysCount}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Monitor className="h-3.5 w-3.5 text-gray-700" />
            <span>{pt ? "Sistemas" : "Systems"}: <strong className="text-[#272727]">{systemsCount}</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Full Ribbon for L1 Detail View - Exactly 5 core metrics
  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3",
      className
    )}>
      {/* 1. Processos */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-3.5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#A5A7B0] mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            {pt ? "Processos" : "Processes"}
          </span>
          <Boxes className="h-4 w-4 text-[#0C1BA8]" />
        </div>
        <div className="text-2xl font-extrabold text-[#272727]">
          {totalProcesses}
        </div>
        <div className="text-[10px] text-[#A5A7B0] mt-0.5">
          {pt ? "Unidades operacionais" : "Operational units"}
        </div>
      </div>

      {/* 2. Documentação */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-3.5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#A5A7B0] mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            {pt ? "Documentação" : "Documented"}
          </span>
          <FileText className="h-4 w-4 text-blue-600" />
        </div>
        <div className="text-2xl font-extrabold text-[#272727]">
          {docPercent}%
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
          <div 
            className="bg-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(docPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* 3. Contexto Validado */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-3.5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#A5A7B0] mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            {pt ? "Contexto Validado" : "Validated Context"}
          </span>
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
        </div>
        <div className="text-2xl font-extrabold text-[#272727]">
          {contextPercent}%
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5 overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(contextPercent, 100)}%` }}
          />
        </div>
      </div>

      {/* 4. Jornadas */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-3.5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#A5A7B0] mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            {pt ? "Jornadas" : "Journeys"}
          </span>
          <Route className="h-4 w-4 text-purple-600" />
        </div>
        <div className="text-2xl font-extrabold text-[#272727]">
          {journeysCount}
        </div>
        <div className="text-[10px] text-[#A5A7B0] mt-0.5">
          {pt ? "Fluxos end-to-end" : "End-to-end flows"}
        </div>
      </div>

      {/* 5. Sistemas */}
      <div className="bg-white border border-[#A5A7B0]/20 rounded-md p-3.5 flex flex-col justify-between shadow-xs">
        <div className="flex items-center justify-between text-[#A5A7B0] mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B7280]">
            {pt ? "Sistemas" : "Systems"}
          </span>
          <Monitor className="h-4 w-4 text-gray-700" />
        </div>
        <div className="text-2xl font-extrabold text-[#272727]">
          {systemsCount}
        </div>
        <div className="text-[10px] text-[#A5A7B0] mt-0.5">
          {pt ? "Ferramentas & apps" : "Tools & apps"}
        </div>
      </div>
    </div>
  );
}
