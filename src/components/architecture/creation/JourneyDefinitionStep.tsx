import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ProcessData } from "@/stores/processStore";
import {
  StudioJourneyMetadata,
  StudioAIInput,
  StudioMode,
} from "./types";
import {
  Sparkles,
  ArrowRight,
  Zap,
  Flag,
  ChevronDown,
  ChevronUp,
  Clock,
  Layers,
  Info,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JourneyDefinitionStepProps {
  mode: StudioMode;
  onModeChange?: (mode: StudioMode) => void;
  metadata: StudioJourneyMetadata;
  onMetadataChange: (metadata: StudioJourneyMetadata) => void;
  aiInput: StudioAIInput;
  onAIInputChange?: (aiInput: StudioAIInput) => void;
  onAiInputChange?: (aiInput: StudioAIInput) => void;
  availableProcesses?: ProcessData[];
  onContinue?: () => void;
  onAdvanceToComposition?: () => void;
  onGenerateAI?: () => void;
  isGeneratingAI?: boolean;
}

export function JourneyDefinitionStep({
  mode,
  onModeChange,
  metadata,
  onMetadataChange,
  aiInput,
  onAIInputChange,
  onAiInputChange,
  availableProcesses = [],
  onContinue,
  onAdvanceToComposition,
  onGenerateAI,
  isGeneratingAI = false,
}: JourneyDefinitionStepProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  // Harmonize callbacks
  const handleAIInputChange = (updated: StudioAIInput) => {
    if (onAIInputChange) onAIInputChange(updated);
    else if (onAiInputChange) onAiInputChange(updated);
  };

  const handleContinue = () => {
    if (onContinue) onContinue();
    else if (onAdvanceToComposition) onAdvanceToComposition();
  };

  const handleGenerate = () => {
    if (onGenerateAI) onGenerateAI();
    else if (onAdvanceToComposition) onAdvanceToComposition();
  };

  // Controle de colapso da seção de Informações Adicionais (fechada por padrão)
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  // Preenchimento de mock instantâneo para facilitar demonstração e teste
  const fillManualMockExample = () => {
    onMetadataChange({
      namePT: "Order to Cash",
      nameEN: "Order to Cash",
      description: "Jornada ponta a ponta desde a qualificação comercial e precificação até a formalização contratual, faturamento e recebimento financeiro.",
      category: "operational",
      status: "draft",
      owner: "Mariana Vasconcelos",
      objective: "Acompanhar a entrega desde a oportunidade comercial até o recebimento.",
      triggerEvent: "Oportunidade comercial aprovada",
      expectedOutcome: "Venda faturada e recebimento registrado",
      startProcess: "Qualificar Oportunidade",
      endProcess: "Registrar Pagamento",
      avgDuration: "5 dias úteis",
      slaTarget: "48h",
    });
  };

  const fillAIPromptExample = (promptText: string, domain = "Gestão Comercial") => {
    onAIInputChange({
      ...aiInput,
      prompt: promptText,
      domain,
      objective: "Garantir previsibilidade de receita e entrega ágil de ponta a ponta.",
      systems: "Salesforce, SAP, DocuSign",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Seletor de Modo (Manual vs IA) no topo */}
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-gray-200 gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-[#0C1BA8] uppercase tracking-wider bg-[#EEF0FF] px-2 py-0.5 rounded">
              {pt ? "Etapa 1 de 2" : "Step 1 of 2"}
            </span>
            <span className="text-xs text-gray-500">
              {mode === "manual"
                ? pt ? "Definição de Parâmetros" : "Parameter Definition"
                : pt ? "Descoberta Assistida" : "Assisted Discovery"}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#272727] mt-1">
            {mode === "manual"
              ? pt ? "Definir a Nova Jornada" : "Define the New Journey"
              : pt ? "Descobrir Jornada com IA" : "Discover Journey with AI"}
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            {mode === "manual"
              ? pt
                ? "Defina o propósito, limites e informações essenciais. Na próxima tela, você montará visualmente a sequência de processos."
                : "Define the purpose, boundaries and essential info. Next, you will visually compose the process flow."
              : pt
                ? "Descreva a entrega de valor desejada. A IA irá sugerir uma composição inicial que você poderá revisar e ajustar no editor."
                : "Describe the desired value delivery. AI will propose an initial composition for you to review."}
          </p>
        </div>

        {/* Alternador de Modo */}
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200/80">
          <button
            type="button"
            onClick={() => onModeChange?.("manual")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer",
              mode === "manual"
                ? "bg-white text-[#0C1BA8] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            {pt ? "Criação Manual" : "Manual Creation"}
          </button>
          <button
            type="button"
            onClick={() => onModeChange?.("ai")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              mode === "ai"
                ? "bg-white text-[#0C1BA8] shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {pt ? "Com IA" : "With AI"}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CRIAÇÃO MANUAL */}
      {/* ========================================================================= */}
      {mode === "manual" && (
        <div className="space-y-8">
          {/* Botão de Preenchimento de Exemplo Rápido */}
          <div className="flex items-center justify-between bg-blue-50/50 border border-blue-100 p-3 rounded-lg text-xs">
            <div className="flex items-center gap-2 text-blue-900">
              <Info className="w-4 h-4 text-[#0C1BA8] shrink-0" />
              <span>
                {pt
                  ? "Deseja testar rapidamente com dados padronizados?"
                  : "Want to quickly test with standardized mock data?"}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fillManualMockExample}
              className="h-7 text-xs border-[#0C1BA8]/30 text-[#0C1BA8] hover:bg-blue-50 font-semibold"
            >
              {pt ? "Carregar exemplo Order to Cash" : "Load Order to Cash example"}
            </Button>
          </div>

          {/* SEÇÃO 1: Informações Básicas */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-2xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-[#272727] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0C1BA8]" />
                {pt ? "1. Informações Básicas" : "1. Basic Information"}
              </h3>
              <p className="text-xs text-gray-500">
                {pt ? "Identificação, categoria e governança da jornada." : "Identification, category and journey governance."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {pt ? "Nome da Jornada (PT) *" : "Journey Name (PT) *"}
                </Label>
                <Input
                  value={metadata.namePT}
                  onChange={(e) => onMetadataChange({ ...metadata, namePT: e.target.value })}
                  placeholder={pt ? "Ex.: Order to Cash" : "e.g., Order to Cash"}
                  className="rounded-md"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {pt ? "Nome em Inglês (Opcional)" : "English Name (Optional)"}
                </Label>
                <Input
                  value={metadata.nameEN}
                  onChange={(e) => onMetadataChange({ ...metadata, nameEN: e.target.value })}
                  placeholder="e.g., Order to Cash"
                  className="rounded-md"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                {pt ? "Descrição da Jornada" : "Journey Description"}
              </Label>
              <Textarea
                rows={2}
                value={metadata.description}
                onChange={(e) => onMetadataChange({ ...metadata, description: e.target.value })}
                placeholder={pt ? "Explique brevemente o escopo e a entrega de valor contemplada..." : "Briefly describe the scope and value delivered..."}
                className="rounded-md text-xs resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {pt ? "Categoria" : "Category"}
                </Label>
                <Select
                  value={metadata.category}
                  onValueChange={(val: any) => onMetadataChange({ ...metadata, category: val })}
                >
                  <SelectTrigger className="rounded-md text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operational">{pt ? "Operacional" : "Operational"}</SelectItem>
                    <SelectItem value="customer">{pt ? "Cliente" : "Customer"}</SelectItem>
                    <SelectItem value="financial">{pt ? "Financeira" : "Financial"}</SelectItem>
                    <SelectItem value="compliance">{pt ? "Conformidade" : "Compliance"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {pt ? "Responsável Principal" : "Owner"}
                </Label>
                <Input
                  value={metadata.owner}
                  onChange={(e) => onMetadataChange({ ...metadata, owner: e.target.value })}
                  placeholder={pt ? "Ex.: Mariana Vasconcelos" : "e.g., Jane Doe"}
                  className="rounded-md text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-gray-700">
                  {pt ? "Status Inicial" : "Initial Status"}
                </Label>
                <Select
                  value={metadata.status}
                  onValueChange={(val: any) => onMetadataChange({ ...metadata, status: val })}
                >
                  <SelectTrigger className="rounded-md text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{pt ? "Rascunho" : "Draft"}</SelectItem>
                    <SelectItem value="active">{pt ? "Ativa / Publicada" : "Active / Published"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: Propósito e Limites da Jornada (Destaque Principal) */}
          <div className="bg-white border-2 border-[#0C1BA8]/20 rounded-xl p-6 shadow-sm space-y-4 relative overflow-hidden">
            <div className="border-b border-gray-100 pb-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0C1BA8] flex items-center gap-2">
                  <Flag className="w-4 h-4 text-[#0C1BA8]" />
                  {pt ? "2. Propósito e Limites da Entrega Ponta a Ponta" : "2. Purpose & End-to-End Boundaries"}
                </h3>
                <Badge className="bg-[#EEF0FF] text-[#0C1BA8] border-0 text-[10px] font-semibold">
                  {pt ? "Definição de Valor" : "Value Definition"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {pt
                  ? "Delimite claramente o evento disparador inicial e o resultado de valor entregue ao final."
                  : "Clearly outline what triggers this journey and what final value it delivers."}
              </p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                {pt ? "Objetivo da Jornada" : "Journey Objective"}
              </Label>
              <Input
                value={metadata.objective}
                onChange={(e) => onMetadataChange({ ...metadata, objective: e.target.value })}
                placeholder={pt ? "Ex.: Acompanhar a entrega desde a oportunidade comercial até o recebimento." : "e.g., Track value delivery from sales opportunity to payment receipt."}
                className="rounded-md text-xs"
              />
            </div>

            {/* Destaque visual: O que inicia a jornada? vs Qual resultado final ela entrega? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>{pt ? "O que inicia a jornada? (Gatilho)" : "What triggers the journey?"}</span>
                </div>
                <Input
                  value={metadata.triggerEvent}
                  onChange={(e) => onMetadataChange({ ...metadata, triggerEvent: e.target.value })}
                  placeholder={pt ? "Ex.: Oportunidade comercial aprovada" : "e.g., Sales opportunity qualified"}
                  className="bg-white border-amber-200 text-xs rounded-md"
                />
                <p className="text-[10px] text-amber-700/80">
                  {pt ? "Evento de negócio ou demanda externa que dispara a execução." : "Business event or external demand triggering execution."}
                </p>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-200/70 p-3.5 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{pt ? "Qual resultado final ela entrega? (Desfecho)" : "What final outcome does it deliver?"}</span>
                </div>
                <Input
                  value={metadata.expectedOutcome}
                  onChange={(e) => onMetadataChange({ ...metadata, expectedOutcome: e.target.value })}
                  placeholder={pt ? "Ex.: Venda faturada e recebimento registrado" : "e.g., Invoice billed and payment received"}
                  className="bg-white border-emerald-200 text-xs rounded-md"
                />
                <p className="text-[10px] text-emerald-700/80">
                  {pt ? "Entrega de valor tangível para a organização ou cliente." : "Tangible value delivered to client or organization."}
                </p>
              </div>
            </div>

            {/* Processos Extremos (Inicial e Final) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  {pt ? "Processo Inicial (Opcional)" : "Starting Process (Optional)"}
                </Label>
                <Select
                  value={metadata.startProcess || ""}
                  onValueChange={(val) => onMetadataChange({ ...metadata, startProcess: val })}
                >
                  <SelectTrigger className="rounded-md text-xs">
                    <SelectValue placeholder={pt ? "Selecione o processo de partida..." : "Select start process..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableProcesses || []).map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name} ({p.l1 || "Geral"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-600">
                  {pt ? "Processo Final (Opcional)" : "Ending Process (Optional)"}
                </Label>
                <Select
                  value={metadata.endProcess || ""}
                  onValueChange={(val) => onMetadataChange({ ...metadata, endProcess: val })}
                >
                  <SelectTrigger className="rounded-md text-xs">
                    <SelectValue placeholder={pt ? "Selecione o processo de conclusão..." : "Select end process..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableProcesses || []).map((p) => (
                      <SelectItem key={p.id} value={p.name}>
                        {p.name} ({p.l1 || "Geral"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: Informações Adicionais (Recolhida por padrão) */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
            <button
              type="button"
              onClick={() => setShowAdditionalInfo(!showAdditionalInfo)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <div>
                  <h4 className="text-xs font-bold text-[#272727]">
                    {pt ? "3. Informações Adicionais (Prazos e Metas de SLA)" : "3. Additional Information (Lead Times & SLA)"}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {pt ? "Campos complementares para medição operacional (opcionais)." : "Optional operational measurement fields."}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#0C1BA8] font-medium">
                <span>{showAdditionalInfo ? (pt ? "Recolher" : "Collapse") : (pt ? "Expandir" : "Expand")}</span>
                {showAdditionalInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showAdditionalInfo && (
              <div className="p-6 pt-2 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-700">
                    {pt ? "Duração Média Estimada" : "Estimated Average Duration"}
                  </Label>
                  <Input
                    value={metadata.avgDuration || ""}
                    onChange={(e) => onMetadataChange({ ...metadata, avgDuration: e.target.value })}
                    placeholder={pt ? "Ex.: 5 dias úteis" : "e.g., 5 business days"}
                    className="rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-gray-700">
                    {pt ? "Meta de SLA da Jornada" : "Journey SLA Target"}
                  </Label>
                  <Input
                    value={metadata.slaTarget || ""}
                    onChange={(e) => onMetadataChange({ ...metadata, slaTarget: e.target.value })}
                    placeholder={pt ? "Ex.: 48h" : "e.g., 48h"}
                    className="rounded-md text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Botão de Avanço para a Tela 2 */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-200">
            <span className="text-xs text-gray-400">
              {pt
                ? "* Preencha pelo menos o nome da jornada para avançar"
                : "* Fill in at least the journey name to continue"}
            </span>
            <Button
              type="button"
              onClick={handleContinue}
              disabled={!metadata.namePT.trim()}
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white px-6 font-semibold gap-2 shadow-sm rounded-md"
            >
              <span>{pt ? "Continuar para composição do fluxo" : "Continue to flow composition"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CRIAÇÃO ASSISTIDA POR IA */}
      {/* ========================================================================= */}
      {mode === "ai" && (
        <div className="space-y-6">
          {/* Card Principal de Entrada da IA */}
          <div className="bg-white border-2 border-indigo-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-gray-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5 text-[#0C1BA8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#272727]">
                  {pt ? "Descreva a entrega de valor que você quer mapear" : "Describe the value delivery you want to map"}
                </h3>
                <p className="text-xs text-gray-500">
                  {pt
                    ? "Explique em linguagem natural os passos, intenções de negócio ou dores do fluxo."
                    : "Explain in natural language the steps, business intents or operational flow."}
                </p>
              </div>
            </div>

            {/* Exemplos Rápidos */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                {pt ? "Exemplos prontos para testar:" : "Ready-to-use examples:"}
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    fillAIPromptExample(
                      "Quero mapear a jornada desde a qualificação de uma oportunidade comercial até o recebimento do pagamento."
                    )
                  }
                  className="text-xs bg-indigo-50/80 hover:bg-indigo-100 text-[#0C1BA8] px-3 py-1 rounded-full font-medium transition-colors border border-indigo-200 text-left"
                >
                  💡 Order to Cash comercial (Oportunidade &rarr; Pagamento)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fillAIPromptExample(
                      "Mapear a contratação de suprimentos industriais e cotação de insumos até a emissão do pedido de compra.",
                      "Suprimentos e Logística"
                    )
                  }
                  className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium transition-colors text-left"
                >
                  📦 Source to Pay (Cotação &rarr; Pedido de Compra)
                </button>
              </div>
            </div>

            {/* Campo Principal */}
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-800">
                {pt ? "Descreva a jornada que deseja mapear *" : "Describe the journey to map *"}
              </Label>
              <Textarea
                rows={4}
                value={aiInput?.prompt || ""}
                onChange={(e) => handleAIInputChange({ ...aiInput, prompt: e.target.value })}
                placeholder={
                  pt
                    ? "Ex.: Quero mapear a jornada desde a qualificação de uma oportunidade comercial até o recebimento do pagamento."
                    : "e.g., I want to map the journey from sales opportunity qualification to invoice receipt."
                }
                className="text-sm rounded-md resize-none border-gray-300 focus:border-[#0C1BA8]"
              />
            </div>

            {/* Mensagem Explicativa Conforme Prompt */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-lg flex items-start gap-3">
              <Info className="w-4 h-4 text-[#0C1BA8] shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                {pt
                  ? "A IA irá sugerir uma composição da jornada atual com base nas informações fornecidas e nos processos existentes na sua arquitetura. Você poderá revisar tudo no editor antes de salvar."
                  : "AI will propose an initial composition based on provided info and processes in your architecture. You can review and refine everything in the editor before saving."}
              </p>
            </div>

            {/* Campos Opcionais de Contexto Adicional */}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                {pt ? "Campos Opcionais de Refinamento:" : "Optional Refinement Fields:"}
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">{pt ? "Domínio ou Área Principal" : "Main Domain or Area"}</Label>
                  <Input
                    value={aiInput?.domain || ""}
                    onChange={(e) => handleAIInputChange({ ...aiInput, domain: e.target.value })}
                    placeholder={pt ? "Ex.: Gestão Comercial" : "e.g., Commercial Management"}
                    className="rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-gray-600">{pt ? "Sistemas Envolvidos" : "Systems Involved"}</Label>
                  <Input
                    value={aiInput?.systems || ""}
                    onChange={(e) => handleAIInputChange({ ...aiInput, systems: e.target.value })}
                    placeholder={pt ? "Ex.: Salesforce, SAP, DocuSign" : "e.g., Salesforce, SAP"}
                    className="rounded-md text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Botão de Geração com IA */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {pt
                ? "Após a geração, o fluxo abrirá diretamente no editor de composição"
                : "After generation, flow opens directly in composition editor"}
            </span>
            <Button
              type="button"
              onClick={handleGenerate}
              disabled={!aiInput?.prompt?.trim() || isGeneratingAI}
              className="bg-[#0C1BA8] hover:bg-[#04223D] text-white px-6 font-semibold gap-2 shadow-sm rounded-md"
            >
              {isGeneratingAI ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{pt ? "Compondo sugestão..." : "Composing suggestion..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{pt ? "Gerar sugestão" : "Generate suggestion"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
