import { useState } from "react";
import { 
  Building2, User, Clock, FileText, CheckCircle2, AlertCircle, 
  ShieldCheck, TrendingUp, Layers, Sparkles, ChevronRight,
  ExternalLink, ArrowRight, CornerDownLeft, RefreshCw, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { OperationalProcessDetail } from "@/types/architectureContextTypes";
import { BreadcrumbStep } from "./ScopeContextSheet";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface OperationalProcessViewProps {
  processDetail: OperationalProcessDetail;
  breadcrumbs: BreadcrumbStep[];
  onOpenSop?: () => void;
  onEditBpmn?: () => void;
  onEvaluateAutomation?: () => void;
}

export function OperationalProcessView({
  processDetail,
  breadcrumbs,
  onOpenSop,
  onEditBpmn,
  onEvaluateAutomation,
}: OperationalProcessViewProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const navigate = useNavigate();

  const responsibleName = typeof processDetail.responsible === "string"
    ? processDetail.responsible
    : processDetail.responsible?.name || "Não informado";

  const responsibleRole = typeof processDetail.responsible === "object"
    ? processDetail.responsible?.role || processDetail.responsible?.title
    : null;

  return (
    <div className="w-full space-y-5 animate-in fade-in-50 duration-200">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-xs text-[#71809A] flex-wrap py-1">
        {breadcrumbs.map((crumb, idx) => (
          <span key={idx} className="flex items-center gap-1.5">
            {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0]/60" />}
            <button
              onClick={crumb.onClick}
              className={cn(
                "transition-colors hover:text-[#1327b9]",
                idx === breadcrumbs.length - 1 ? "font-semibold text-[#15233B] cursor-default" : "text-[#71809A]"
              )}
            >
              {crumb.label}
            </button>
          </span>
        ))}
      </nav>

      {/* ── Header do Processo Operacional ── */}
      <div className="bg-white border border-[#DFE5EF] rounded shadow-[0_10px_32px_rgba(20,35,70,0.06)] p-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-[#E3FAEF] text-[#008B5C]">
                {pt ? "Processo operacional · BPMN / SOP" : "Operational Process · BPMN / SOP"}
              </span>
              {processDetail.sopCode && (
                <span className="text-[11px] font-mono text-[#71809A] bg-[#F5F7FB] px-1.5 py-0.5 rounded border border-[#DFE5EF]">
                  {processDetail.sopCode}
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-[#15233B] tracking-tight leading-tight">
              {processDetail.name}
            </h1>

            <p className="text-sm text-[#71809A] leading-relaxed">
              {processDetail.description}
            </p>

            {/* Metadados */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-3 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <User className="h-4 w-4 text-[#1327b9]" />
                <span>{pt ? "Responsável:" : "Responsible:"}</span>
                <strong className="text-[#15233B] font-semibold">
                  {responsibleName}
                  {responsibleRole && <span className="font-normal text-[#71809A]"> ({responsibleRole})</span>}
                </strong>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-3 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <Building2 className="h-4 w-4 text-[#7648E7]" />
                <span>{pt ? "Unidade:" : "Unit:"}</span>
                <strong className="text-[#15233B] font-semibold">
                  {processDetail.businessUnit || (pt ? "Não informada" : "Not specified")}
                </strong>
              </div>

              <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-3 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                <span className="h-2 w-2 rounded-full bg-[#1327b9]" />
                <span>{pt ? "Dimensionamento:" : "Sizing:"}</span>
                <strong className="text-[#15233B] font-semibold">
                  {processDetail.dimensioning 
                    ? `${processDetail.dimensioning.allocatedFte} ${processDetail.dimensioning.unit || "FTE"} alocados`
                    : "5 FTE alocados"}
                </strong>
              </div>

              {processDetail.sopCode && (
                <div className="flex items-center gap-2 bg-[#E8EDFF] border border-[#C6D2FF] px-3 py-1.5 rounded-lg text-xs text-[#1327b9]">
                  <FileText className="h-4 w-4" />
                  <strong className="font-semibold">
                    {processDetail.sopCode} {processDetail.sopVersion && `· ${processDetail.sopVersion}`}
                  </strong>
                </div>
              )}

              {processDetail.validationConfidence !== undefined && (
                <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-3 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                  <ShieldCheck className="h-4 w-4 text-[#008B5C]" />
                  <span>{pt ? "Documentação gerada:" : "Generated documentation:"}</span>
                  <strong className="text-[#008B5C] font-semibold">{processDetail.validationConfidence}%</strong>
                </div>
              )}

              {processDetail.revisionDate && (
                <div className="flex items-center gap-2 bg-[#F5F7FB] border border-[#DFE5EF] px-3 py-1.5 rounded-lg text-xs text-[#4D5A72]">
                  <Clock className="h-4 w-4 text-[#8A96A9]" />
                  <span>{pt ? "Revisão:" : "Revision:"} <strong className="text-[#15233B]">{processDetail.revisionDate}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Ações */}
          <div className="flex items-center gap-2 flex-wrap self-start">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOpenSop || (() => toast.info(pt ? `Visualizando ${processDetail.sopCode || "SOP"}` : "Opening SOP"))}
              className="text-xs h-9 border-[#CFD7E6] text-[#1A2A48] hover:border-[#1327b9] hover:text-[#1327b9]"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" />
              {pt ? "Abrir SOP" : "Open SOP"}
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={onEditBpmn || (() => toast.info(pt ? "Editor BPMN em breve" : "BPMN Editor coming soon"))}
              className="text-xs h-9 border-[#CFD7E6] text-[#1A2A48] hover:border-[#1327b9] hover:text-[#1327b9]"
            >
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              {pt ? "Editar BPMN" : "Edit BPMN"}
            </Button>

            <Button 
              size="sm" 
              onClick={onEvaluateAutomation || (() => navigate("/automation"))}
              className="text-xs h-9 bg-[#1327b9] hover:bg-[#2743D7] text-white"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-300" />
              {pt ? "Avaliar automação" : "Evaluate automation"}
            </Button>
          </div>
        </div>
      </div>

      {/* ── Layout Operacional: BPMN + Automação ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Coluna 1 e 2: Fluxo BPMN Modelado */}
        <div className="lg:col-span-2 bg-white border border-[#DFE5EF] rounded p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-[#15233B]">
              {pt ? "Fluxo operacional modelado" : "Modeled operational flow"}
            </h3>
            <p className="text-xs text-[#8490A3] mt-0.5">
              {pt 
                ? "O fluxo pode conter sequência, gateways, paralelismo, eventos, exceções, retornos e handoffs — não é obrigatório que seja linear."
                : "Operational flow contains sequence, gateways, parallelism, exceptions, returns, and handoffs."}
            </p>
          </div>

          {/* Diagrama BPMN Visual */}
          <div className="flex items-center gap-2 overflow-x-auto py-5 px-2 bg-[#F7F9FD] border border-[#DFE5EF] rounded">
            {processDetail.flowSteps.map((step, idx) => {
              if (step.type === "gateway_exclusive") {
                return (
                  <div key={step.id} className="flex items-center gap-2 shrink-0">
                    <div className="w-[140px] flex flex-col items-center justify-center relative py-2">
                      <div className="w-[72px] h-[72px] rotate-45 border-2 border-[#ED9C12] bg-[#FFF9EE] flex items-center justify-center shadow-sm">
                        <span className="-rotate-45 text-[10px] font-bold text-[#78520A] text-center px-1 leading-tight max-w-[62px]">
                          {step.name}
                        </span>
                      </div>
                      <span className="text-[9px] text-[#8C99AC] mt-3 font-medium">
                        Gateway exclusivo
                      </span>
                    </div>
                    <span className="text-[#1327b9] font-bold text-lg select-none px-1">→</span>
                  </div>
                );
              }

              const isEvent = step.type === "event_start" || step.type === "event_end";
              const isGood = step.status === "good";
              const isRisk = step.status === "risk";

              return (
                <div key={step.id} className="flex items-center gap-2 shrink-0">
                  <div className={cn(
                    "w-[145px] min-h-[120px] bg-white border-2 rounded p-3 text-left shadow-sm flex flex-col justify-between transition-all hover:shadow-md",
                    isGood ? "border-[#008B5C]" : isRisk ? "border-[#E2484E]" : "border-[#697A99]"
                  )}>
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#71809A]">
                          {isEvent ? (step.type === "event_start" ? "Evento Início" : "Evento Fim") : "Atividade"}
                        </span>
                        {step.sla && (
                          <span className="text-[8px] font-semibold text-[#E2484E] bg-red-50 px-1 py-0.2 rounded">
                            {step.sla}
                          </span>
                        )}
                      </div>
                      <b className="block text-xs text-[#15233B] font-semibold leading-tight">
                        {step.name}
                      </b>
                    </div>

                    <small className="block text-[10px] text-[#62708A] mt-2 pt-1 border-t border-[#DFE5EF]/60 line-clamp-2">
                      {step.description || step.system || ""}
                    </small>
                  </div>

                  {idx < processDetail.flowSteps.length - 1 && (
                    <span className="text-[#1327b9] font-bold text-lg select-none px-1">→</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Notas de Exceções e Retrabalhos */}
          <div className="p-3.5 border-l-4 border-l-[#7648E7] bg-[#FAF8FF] text-xs text-[#465272] rounded-r space-y-1">
            <p>
              <strong className="text-[#49319C] font-semibold">{pt ? "Exceção modelada:" : "Modeled exception:"}</strong>{" "}
              {processDetail.exceptionsNote || (pt 
                ? "Se os dados estiverem incompletos, o processo retorna para enriquecimento; se o lead não apresentar aderência, é encerrado com motivo obrigatório."
                : "Incomplete data triggers return loops; non-adherent items are closed with mandatory reasons.")}
            </p>
            {processDetail.handoffsNote && (
              <p className="pt-1 text-[#6633D0]">
                <strong>{pt ? "Handoff:" : "Handoff:"}</strong> {processDetail.handoffsNote}
              </p>
            )}
          </div>
        </div>

        {/* Coluna 3: Prontidão para Automação */}
        <div className="bg-white border border-[#DFE5EF] rounded p-5 shadow-sm space-y-3">
          <div>
            <h3 className="text-sm font-bold text-[#15233B] flex items-center gap-1.5">
              <Zap className="h-4 w-4 text-[#008B5C]" />
              {pt ? "Prontidão para automação" : "Automation Readiness"}
            </h3>
            <p className="text-xs text-[#8490A3] mt-0.5">
              {pt 
                ? "Consolidação de atividades, regras, sistemas e oportunidades de ganho."
                : "Consolidated activities, rules, systems, and potential gains."}
            </p>
          </div>

          <div className="space-y-2.5">
            {processDetail.automationReadiness?.map((item, idx) => (
              <div key={idx} className="p-3 border border-[#DCE4EF] bg-[#FAFFFD] rounded text-xs space-y-1 hover:border-[#008B5C] transition-colors">
                <div className="flex items-center justify-between">
                  <b className="text-[#15233B] font-semibold">{item.title}</b>
                  <span className="font-extrabold text-[#008D61] text-xs">
                    {item.score}/100
                  </span>
                </div>
                <p className="text-[#62708A] text-[11px] leading-relaxed">
                  {item.description}
                </p>
                <div className="pt-1 text-[10px] text-[#008D61] font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>{pt ? "Recomendação:" : "Recommendation:"} {item.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Ficha de Contexto Operacional ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div className="bg-white border border-[#DFE5EF] border-t-[3px] border-t-[#1327b9] rounded p-4 shadow-sm min-h-[96px]">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-2">
            {pt ? "Objetivo e resultado" : "Objective and outcome"}
          </h3>
          <p className="text-xs text-[#34445F] leading-relaxed">
            {processDetail.objective}
          </p>
          {processDetail.outcome && (
            <p className="text-xs text-[#34445F] leading-relaxed mt-2 pt-2 border-t border-[#DFE5EF]/60">
              <strong className="text-[#15233B] font-semibold">{pt ? "Resultado esperado:" : "Expected outcome:"}</strong> {processDetail.outcome}
            </p>
          )}
        </div>

        <div className="bg-white border border-[#DFE5EF] border-t-[3px] border-t-[#ED9C12] rounded p-4 shadow-sm min-h-[96px]">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-2">
            {pt ? "Gatilho e critério de encerramento" : "Trigger and closing criteria"}
          </h3>
          <p className="text-xs text-[#34445F] leading-relaxed">
            <strong className="text-[#15233B] font-semibold">{pt ? "Gatilho:" : "Trigger:"}</strong> {processDetail.trigger}
          </p>
          <p className="text-xs text-[#34445F] leading-relaxed mt-2 pt-2 border-t border-[#DFE5EF]/60">
            <strong className="text-[#15233B] font-semibold">{pt ? "Encerramento:" : "Closing:"}</strong> {processDetail.closingCriteria}
          </p>
        </div>

        <div className="bg-white border border-[#DFE5EF] rounded p-4 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-2">
            {pt ? "Sistemas e objetos de dados" : "Systems and data objects"}
          </h3>
          <div className="text-xs text-[#34445F] space-y-2">
            <div>
              <span className="text-[#8A96A9] block text-[10px] uppercase font-semibold mb-1">
                {pt ? "Sistemas Utilizados" : "Systems Used"}
              </span>
              <div className="flex flex-wrap gap-1">
                {processDetail.systemsUsed.map((sys, i) => (
                  <span key={i} className="bg-[#F5F7FB] border border-[#DFE5EF] px-2 py-0.5 rounded text-[11px] font-medium">
                    {sys}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[#8A96A9] block text-[10px] uppercase font-semibold mb-1">
                {pt ? "Objetos de Dados" : "Data Objects"}
              </span>
              <div className="flex flex-wrap gap-1">
                {processDetail.dataObjects.map((d, i) => (
                  <span key={i} className="bg-white border border-[#DFE5EF] px-2 py-0.5 rounded text-[11px] text-[#4D5A72]">
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#DFE5EF] rounded p-4 shadow-sm">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#72809A] mb-2">
            {pt ? "Normativos, políticas e evidências" : "Policies, regulations & evidence"}
          </h3>
          <div className="text-xs text-[#34445F] space-y-2">
            <ul className="space-y-1">
              {processDetail.policies.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-[11px]">
                  <span>{p.name} <small className="text-[#8A96A9]">({p.version})</small></span>
                  <span className="text-[9px] font-semibold text-[#008B5C] bg-[#E3FAEF] px-1.5 py-0.2 rounded">
                    {p.complianceStatus || p.status}
                  </span>
                </li>
              ))}
            </ul>
            {processDetail.evidence && processDetail.evidence.length > 0 && (
              <div className="pt-2 border-t border-[#DFE5EF]/60 text-[11px] text-[#71809A]">
                <span className="font-semibold text-[#15233B]">{pt ? "Evidências:" : "Evidence:"}</span> {processDetail.evidence.join(" · ")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
