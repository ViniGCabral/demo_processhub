import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProcessStore } from "@/stores/processStore";
import {
  useProcessConnectionStore,
  ProcessConnection,
  RELATIONSHIP_LABELS,
} from "@/stores/processConnectionStore";
import { CreateEditConnectionModal } from "./CreateEditConnectionModal";
import {
  GitFork,
  ArrowRight,
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Database,
  Undo2,
  CornerDownRight,
  User,
  Building2,
  Info,
  ChevronRight,
  Network,
} from "lucide-react";
import { toast } from "sonner";

interface ProcessConnectionMapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProcessId: string;
  initialProcessName: string;
  initialDomain?: string;
  onNavigateToProcess?: (processId: string, processName: string) => void;
}

export function ProcessConnectionMapModal({
  open,
  onOpenChange,
  initialProcessId,
  initialProcessName,
  initialDomain = "Gestão Comercial",
  onNavigateToProcess,
}: ProcessConnectionMapModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const allProcesses = useProcessStore((s) => s.processes);

  const {
    getPredecessors,
    getSuccessors,
    getAllConnections,
    deleteConnection,
  } = useProcessConnectionStore();

  // Estado do processo em foco (central)
  const [currentProcess, setCurrentProcess] = useState({
    id: initialProcessId,
    name: initialProcessName,
    domain: initialDomain,
  });

  // Histórico de navegação dentro do mapa
  const [history, setHistory] = useState<
    Array<{ id: string; name: string; domain?: string }>
  >([]);

  // Sincronizar quando abrir com novas props
  useEffect(() => {
    if (open) {
      setCurrentProcess({
        id: initialProcessId,
        name: initialProcessName,
        domain: initialDomain,
      });
      setHistory([]);
    }
  }, [open, initialProcessId, initialProcessName, initialDomain]);

  // Modal de criação / edição de conexão
  const [isConnModalOpen, setIsConnModalOpen] = useState(false);
  const [editingConn, setEditingConn] = useState<ProcessConnection | null>(null);
  const [defaultDirection, setDefaultDirection] = useState<
    "predecessor" | "successor"
  >("predecessor");

  // Modal de resumo da conexão clicada
  const [summaryConn, setSummaryConn] = useState<ProcessConnection | null>(null);

  // Filtro de status
  const [statusFilter, setStatusFilter] = useState<"all" | "validada" | "pendente">("all");

  // Lookup de dados completos do processo central
  const centralProcessData = useMemo(() => {
    return (
      allProcesses.find(
        (p) =>
          p.id === currentProcess.id ||
          p.name.trim().toLowerCase() === currentProcess.name.trim().toLowerCase()
      ) || null
    );
  }, [allProcesses, currentProcess]);

  const rawPredecessors = useMemo(() => {
    return getPredecessors(currentProcess.id, currentProcess.name);
  }, [currentProcess, getPredecessors]);

  const rawSuccessors = useMemo(() => {
    return getSuccessors(currentProcess.id, currentProcess.name);
  }, [currentProcess, getSuccessors]);

  const allConnections = useMemo(() => {
    return getAllConnections();
  }, [getAllConnections]);

  const predecessors = useMemo(() => {
    if (statusFilter === "all") return rawPredecessors;
    return rawPredecessors.filter((c) => c.validationStatus === statusFilter);
  }, [rawPredecessors, statusFilter]);

  const successors = useMemo(() => {
    if (statusFilter === "all") return rawSuccessors;
    return rawSuccessors.filter((c) => c.validationStatus === statusFilter);
  }, [rawSuccessors, statusFilter]);

  // Calcula se o sucessor possui continuidade a jusante (downstream)
  const getDownstreamChain = (targetName: string): string[] => {
    const directNext = allConnections.filter(
      (c) => c.sourceProcessName.trim().toLowerCase() === targetName.trim().toLowerCase()
    );
    if (directNext.length === 0) return [];
    
    const chain: string[] = [];
    directNext.forEach((d) => {
      chain.push(d.targetProcessName);
      // Próximo nível (2º salto)
      const secondNext = allConnections.filter(
        (c) => c.sourceProcessName.trim().toLowerCase() === d.targetProcessName.trim().toLowerCase()
      );
      secondNext.forEach((s) => chain.push(s.targetProcessName));
    });
    return Array.from(new Set(chain));
  };

  const handleCenterOnProcess = (id: string, name: string, domain?: string) => {
    setHistory((prev) => [...prev, currentProcess]);
    setCurrentProcess({ id, name, domain: domain || "Gestão Comercial" });
    toast.info(pt ? `Mapa centralizado em: ${name}` : `Map focused on: ${name}`);
  };

  const handleGoBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentProcess(prev);
  };

  const handleDelete = (id: string, name: string) => {
    if (
      window.confirm(
        pt
          ? `Deseja realmente remover a conexão com "${name}"?`
          : `Are you sure you want to remove connection with "${name}"?`
      )
    ) {
      deleteConnection(id);
      toast.success(pt ? "Conexão removida com sucesso" : "Connection removed");
    }
  };

  const openNewConnection = (dir: "predecessor" | "successor") => {
    setEditingConn(null);
    setDefaultDirection(dir);
    setIsConnModalOpen(true);
  };

  const openEditConnection = (conn: ProcessConnection) => {
    setEditingConn(conn);
    setIsConnModalOpen(true);
  };

  const isTotalEmpty = rawPredecessors.length === 0 && rawSuccessors.length === 0;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[92vh] flex flex-col p-6 overflow-hidden bg-white">
          <DialogHeader className="pb-3 border-b border-gray-100 shrink-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#0C1BA8]/10 text-[#0C1BA8] flex items-center justify-center font-bold">
                  <GitFork className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-[#272727] flex items-center gap-2">
                    {pt ? "Mapa de Conexões Locais do Processo" : "Local Process Connection Map"}
                  </DialogTitle>
                  <p className="text-xs text-[#A5A7B0]">
                    {pt
                      ? "Visualização de handoffs, insumos de entrada, processo central e saídas na cadeia de valor"
                      : "Direct upstream and downstream handoffs, inputs, triggers and outputs"}
                  </p>
                </div>
              </div>

              {/* Barra de Ações Rápidas do Cabeçalho */}
              <div className="flex items-center gap-2">
                {history.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGoBack}
                    className="text-xs h-8 gap-1.5 text-gray-700 hover:bg-gray-100"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    {pt ? `Voltar (${history.length})` : `Back (${history.length})`}
                  </Button>
                )}

                {/* Os filtros de status (válidas/pendentes) foram removidos conforme solicitado. */}
              </div>
            </div>
          </DialogHeader>

          {/* Área Central: Grid com 3 Colunas (Predecessores -> Processo Central -> Sucessores) */}
          <div className="flex-1 overflow-y-auto py-4">
            {isTotalEmpty && (
              <div className="mb-4 p-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-amber-900">
                      {pt
                        ? "Este processo ainda não possui processos predecessores ou sucessores mapeados."
                        : "This process has no mapped predecessor or successor processes yet."}
                    </h5>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      {pt
                        ? "Conecte os processos que fornecem insumos de entrada ou que recebem as entregas deste processo."
                        : "Connect upstream processes providing inputs or downstream processes receiving outputs."}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => openNewConnection("predecessor")}
                  className="bg-[#0C1BA8] hover:bg-[#0C1BA8]/90 text-white text-xs h-8 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  {pt ? "Mapear primeira conexão" : "Add first connection"}
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-start min-h-[460px]">
              
              {/* COLUNA ESQUERDA: Predecessores (4 Colunas) */}
              <div className="lg:col-span-4 bg-gray-50/70 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-3 min-h-[440px]">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                      ←
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#272727] uppercase tracking-wide">
                        {pt ? "Processos Predecessores" : "Predecessor Processes"}
                      </h4>
                      <p className="text-[10px] text-[#A5A7B0]">
                        {pt ? "Fornecem insumos ou disparam este processo" : "Feed or trigger this process"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNewConnection("predecessor")}
                    className="h-7 text-[11px] px-2 gap-1 border-dashed border-[#0C1BA8]/40 text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
                  >
                    <Plus className="w-3 h-3" />
                    {pt ? "Conectar" : "Add"}
                  </Button>
                </div>

                {predecessors.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-lg text-gray-400 bg-white">
                    <ArrowLeft className="w-6 h-6 mb-2 stroke-1 text-gray-300" />
                    <p className="text-xs font-medium text-gray-700">
                      {pt ? "Este processo não possui predecessores cadastrados." : "No predecessor registered"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[220px]">
                      {pt
                        ? "Ele inicia este fluxo operacional ou suas entradas ainda não foram mapeadas."
                        : "It initiates this workflow or its inputs haven't been mapped yet."}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openNewConnection("predecessor")}
                      className="mt-3 text-xs text-[#0C1BA8] h-7 hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {pt ? "Cadastrar Predecessor" : "Add Predecessor"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                    {predecessors.map((conn) => {
                      const relInfo = RELATIONSHIP_LABELS[conn.relationshipType] || {
                        pt: conn.relationshipType,
                        en: conn.relationshipType,
                      };
                      return (
                        <div
                          key={conn.id}
                          className="bg-white rounded-lg border border-gray-200 p-3 shadow-2xs hover:border-[#0C1BA8]/50 hover:shadow-xs transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 uppercase tracking-wide">
                                  L4
                                </span>
                                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                                  {conn.sourceDomain || "Gestão Comercial"}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-[#272727] group-hover:text-[#0C1BA8] transition-colors line-clamp-2">
                                {conn.sourceProcessName}
                              </h5>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] shrink-0 font-medium ${
                                conn.validationStatus === "validada"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {conn.validationStatus === "validada" ? (
                                <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />
                              ) : (
                                <Clock className="w-2.5 h-2.5 mr-1 inline" />
                              )}
                              {conn.validationStatus === "validada"
                                ? pt ? "Validada" : "Validated"
                                : pt ? "Pendente" : "Pending"}
                            </Badge>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <span className="inline-flex items-center gap-1 font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded text-[10px]">
                              <CornerDownRight className="w-2.5 h-2.5" />
                              {pt ? relInfo.pt : relInfo.en}
                            </span>
                            {conn.relatedSystem && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1 max-w-[140px] truncate" title={conn.relatedSystem}>
                                <Database className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                {conn.relatedSystem}
                              </span>
                            )}
                          </div>

                          {conn.transferredObject && (
                            <div className="mt-1.5 text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded flex items-center gap-1.5">
                              <span className="font-semibold text-gray-700 shrink-0">{pt ? "Insumo:" : "Input:"}</span>
                              <span className="truncate" title={conn.transferredObject}>{conn.transferredObject}</span>
                            </div>
                          )}

                          {/* 3 Opções Claras: Resumo, Abrir, Centralizar */}
                          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSummaryConn(conn)}
                                className="text-[10px] text-gray-600 hover:text-[#0C1BA8] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                                title={pt ? "Ver resumo da conexão" : "View connection summary"}
                              >
                                <Info className="w-3 h-3 text-[#0C1BA8]" />
                                {pt ? "Resumo" : "Summary"}
                              </button>

                              {onNavigateToProcess && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigateToProcess(
                                      conn.sourceProcessId,
                                      conn.sourceProcessName
                                    )
                                  }
                                  className="text-[10px] text-gray-600 hover:text-[#0C1BA8] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                                  title={pt ? "Abrir detalhamento deste processo" : "Open process details"}
                                >
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                  {pt ? "Abrir" : "Open"}
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleCenterOnProcess(
                                  conn.sourceProcessId,
                                  conn.sourceProcessName,
                                  conn.sourceDomain
                                )
                              }
                              className="text-[10px] text-[#0C1BA8] hover:bg-[#0C1BA8]/10 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-colors"
                              title={pt ? "Centralizar o mapa neste processo" : "Center map on this process"}
                            >
                              <GitFork className="w-3 h-3" />
                              {pt ? "Centralizar" : "Center"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COLUNA CENTRAL: Processo em Foco / Selecionado (3 Colunas) */}
              <div className="lg:col-span-3 flex flex-col items-center justify-center py-2 px-2">
                <div className="w-full relative flex flex-col items-center">
                  
                  {/* Badge de Destaque Central */}
                  <div className="mb-2 flex items-center gap-1.5">
                    <Badge className="bg-[#0C1BA8] text-white text-[10px] font-bold px-2.5 py-0.5 shadow-sm">
                      ★ {pt ? "Processo Selecionado" : "Selected Process"}
                    </Badge>
                    <Badge variant="outline" className="text-[9px] font-bold border-[#0C1BA8]/30 text-[#0C1BA8]">
                      L4
                    </Badge>
                  </div>

                  {/* Card do Processo Central com Metadados Exigidos */}
                  <div className="w-full bg-white border-2 border-[#0C1BA8] rounded-xl p-4 shadow-lg text-left space-y-3 relative">
                    <div className="space-y-1 text-center">
                      <span className="text-[10px] font-bold text-[#0C1BA8] uppercase tracking-wider block">
                        {centralProcessData?.l1 || currentProcess.domain || "Gestão Comercial"}
                      </span>
                      <h3 className="text-sm font-black text-[#272727] leading-snug">
                        {currentProcess.name}
                      </h3>
                      {centralProcessData?.l4 && (
                        <p className="text-[10px] text-gray-500">
                          {pt ? "Nível:" : "Level:"} L4 · {centralProcessData.l4}
                        </p>
                      )}
                    </div>

                    {/* Metadados: Responsável, Sistemas, Status */}
                    <div className="pt-2.5 border-t border-gray-100 space-y-1.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-gray-700">
                        <User className="w-3.5 h-3.5 text-[#0C1BA8] shrink-0" />
                        <span className="text-gray-500 font-medium">{pt ? "Responsável:" : "Owner:"}</span>
                        <span className="font-semibold text-gray-900 truncate">
                          {centralProcessData?.executor || centralProcessData?.owner || "Account Executive Sênior"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-700">
                        <Database className="w-3.5 h-3.5 text-[#0C1BA8] shrink-0" />
                        <span className="text-gray-500 font-medium">{pt ? "Sistemas:" : "Systems:"}</span>
                        <span className="font-semibold text-gray-900 truncate" title={centralProcessData?.systems?.join(", ") || "Planilhas Comerciais / Salesforce"}>
                          {centralProcessData?.systems?.join(" / ") || "Planilhas Comerciais / Salesforce"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-gray-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-gray-500 font-medium">{pt ? "Status:" : "Status:"}</span>
                        <span className="font-semibold text-emerald-700">
                          {centralProcessData?.hasDocumentation ? (pt ? "Ativo / Documentado" : "Active / Documented") : (pt ? "Ativo" : "Active")}
                        </span>
                      </div>
                    </div>

                    {/* Contadores */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-center">
                      <div className="p-2 bg-blue-50/70 rounded-lg">
                        <span className="text-[10px] text-blue-700 block font-medium">
                          {pt ? "Predecessores" : "Predecessors"}
                        </span>
                        <span className="text-base font-bold text-blue-900">
                          {rawPredecessors.length}
                        </span>
                      </div>
                      <div className="p-2 bg-purple-50/70 rounded-lg">
                        <span className="text-[10px] text-purple-700 block font-medium">
                          {pt ? "Sucessores" : "Successors"}
                        </span>
                        <span className="text-base font-bold text-purple-900">
                          {rawSuccessors.length}
                        </span>
                      </div>
                    </div>

                    {/* Botão de Ver Detalhes do Processo */}
                    {onNavigateToProcess && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onNavigateToProcess(
                            currentProcess.id,
                            currentProcess.name
                          )
                        }
                        className="w-full text-xs h-8 gap-1.5 text-[#0C1BA8] border-[#0C1BA8]/30 hover:bg-[#0C1BA8]/5 font-semibold"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {pt ? "Ver Detalhamento Completo" : "View Full Process"}
                      </Button>
                    )}
                  </div>

                  {/* Setas indicativas laterais visíveis em desktop */}
                  <div className="hidden lg:flex justify-between w-full mt-3 px-2 text-[11px] text-gray-500 font-semibold">
                    <span className="flex items-center gap-1 text-blue-700">
                      <ArrowRight className="w-4 h-4 text-blue-700" />
                      {pt ? "Insumos" : "Inputs"}
                    </span>
                    <span className="flex items-center gap-1 text-purple-700">
                      {pt ? "Entregas" : "Outputs"}
                      <ArrowRight className="w-4 h-4 text-purple-700" />
                    </span>
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA: Sucessores (4 Colunas) */}
              <div className="lg:col-span-4 bg-gray-50/70 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-3 min-h-[440px]">
                <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      →
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#272727] uppercase tracking-wide">
                        {pt ? "Processos Sucessores" : "Successor Processes"}
                      </h4>
                      <p className="text-[10px] text-[#A5A7B0]">
                        {pt ? "Recebem entregas ou são disparados por este" : "Receive outputs or are triggered"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openNewConnection("successor")}
                    className="h-7 text-[11px] px-2 gap-1 border-dashed border-[#0C1BA8]/40 text-[#0C1BA8] hover:bg-[#0C1BA8]/5"
                  >
                    <Plus className="w-3 h-3" />
                    {pt ? "Conectar" : "Add"}
                  </Button>
                </div>

                {successors.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-gray-200 rounded-lg text-gray-400 bg-white">
                    <ArrowRight className="w-6 h-6 mb-2 stroke-1 text-gray-300" />
                    <p className="text-xs font-medium text-gray-700">
                      {pt ? "Este processo não possui sucessores cadastrados." : "No successor registered"}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1 max-w-[220px]">
                      {pt
                        ? "Ele encerra esta etapa operacional ou ainda não teve seus processos seguintes documentados."
                        : "It closes this operational step or downstream processes haven't been documented."}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openNewConnection("successor")}
                      className="mt-3 text-xs text-[#0C1BA8] h-7 hover:bg-blue-50"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {pt ? "Cadastrar Sucessor" : "Add Successor"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2.5 flex-1 overflow-y-auto pr-1">
                    {successors.map((conn) => {
                      const relInfo = RELATIONSHIP_LABELS[conn.relationshipType] || {
                        pt: conn.relationshipType,
                        en: conn.relationshipType,
                      };
                      const downstream = getDownstreamChain(conn.targetProcessName);

                      return (
                        <div
                          key={conn.id}
                          className="bg-white rounded-lg border border-gray-200 p-3 shadow-2xs hover:border-[#0C1BA8]/50 hover:shadow-xs transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-50 text-purple-700 uppercase tracking-wide">
                                  L4
                                </span>
                                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block">
                                  {conn.targetDomain || "Gestão Comercial"}
                                </span>
                              </div>
                              <h5 className="text-xs font-bold text-[#272727] group-hover:text-[#0C1BA8] transition-colors line-clamp-2">
                                {conn.targetProcessName}
                              </h5>
                            </div>
                            <Badge
                              variant="outline"
                              className={`text-[9px] shrink-0 font-medium ${
                                conn.validationStatus === "validada"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {conn.validationStatus === "validada" ? (
                                <CheckCircle2 className="w-2.5 h-2.5 mr-1 inline" />
                              ) : (
                                <Clock className="w-2.5 h-2.5 mr-1 inline" />
                              )}
                              {conn.validationStatus === "validada"
                                ? pt ? "Validada" : "Validated"
                                : pt ? "Pendente" : "Pending"}
                            </Badge>
                          </div>

                          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                            <span className="inline-flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[10px]">
                              <CornerDownRight className="w-2.5 h-2.5" />
                              {pt ? relInfo.pt : relInfo.en}
                            </span>
                            {conn.relatedSystem && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1 max-w-[140px] truncate" title={conn.relatedSystem}>
                                <Database className="w-2.5 h-2.5 text-gray-400 shrink-0" />
                                {conn.relatedSystem}
                              </span>
                            )}
                          </div>

                          {conn.transferredObject && (
                            <div className="mt-1.5 text-[10px] text-gray-600 bg-gray-50 p-1.5 rounded flex items-center gap-1.5">
                              <span className="font-semibold text-gray-700 shrink-0">{pt ? "Saída:" : "Output:"}</span>
                              <span className="truncate" title={conn.transferredObject}>{conn.transferredObject}</span>
                            </div>
                          )}

                          {/* Continuidade a jusante (Downstream continuity) */}
                          {downstream.length > 0 && (
                            <div className="mt-2 p-1.5 rounded bg-slate-50 border border-slate-100 text-[10px] text-gray-600">
                              <span className="font-semibold text-[#0C1BA8] block mb-0.5 flex items-center gap-1">
                                <Network className="w-3 h-3" />
                                {pt ? "Continuidade a jusante:" : "Downstream continuity:"}
                              </span>
                              <div className="flex items-center gap-1 text-gray-500 flex-wrap">
                                {downstream.map((step, idx) => (
                                  <span key={idx} className="flex items-center gap-1">
                                    <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
                                    <span className="text-gray-700 font-medium hover:text-[#0C1BA8] cursor-pointer" onClick={() => handleCenterOnProcess(step, step)}>
                                      {step}
                                    </span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 3 Opções Claras: Resumo, Abrir, Centralizar */}
                          <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between gap-1 flex-wrap">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => setSummaryConn(conn)}
                                className="text-[10px] text-gray-600 hover:text-[#0C1BA8] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                                title={pt ? "Ver resumo da conexão" : "View connection summary"}
                              >
                                <Info className="w-3 h-3 text-[#0C1BA8]" />
                                {pt ? "Resumo" : "Summary"}
                              </button>

                              {onNavigateToProcess && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    onNavigateToProcess(
                                      conn.targetProcessId,
                                      conn.targetProcessName
                                    )
                                  }
                                  className="text-[10px] text-gray-600 hover:text-[#0C1BA8] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                                  title={pt ? "Abrir detalhamento deste processo" : "Open process details"}
                                >
                                  <ExternalLink className="w-3 h-3 text-gray-400" />
                                  {pt ? "Abrir" : "Open"}
                                </button>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleCenterOnProcess(
                                  conn.targetProcessId,
                                  conn.targetProcessName,
                                  conn.targetDomain
                                )
                              }
                              className="text-[10px] text-[#0C1BA8] hover:bg-[#0C1BA8]/10 px-2 py-0.5 rounded font-bold flex items-center gap-1 transition-colors"
                              title={pt ? "Centralizar o mapa neste processo" : "Center map on this process"}
                            >
                              <GitFork className="w-3 h-3" />
                              {pt ? "Centralizar" : "Center"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Rodapé informativo */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#A5A7B0] gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-400" />
              <span>
                {pt
                  ? "As conexões cadastradas representam os handoffs operacionais diretos entre processos da cadeia."
                  : "Registered connections represent direct operational handoffs between value chain processes."}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              {pt ? "Fechar Mapa" : "Close"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para Adicionar / Editar Conexão */}
      <CreateEditConnectionModal
        open={isConnModalOpen}
        onOpenChange={setIsConnModalOpen}
        currentProcessId={currentProcess.id}
        currentProcessName={currentProcess.name}
        currentDomain={currentProcess.domain}
        defaultDirection={defaultDirection}
        editingConnection={editingConn}
      />

      {/* Modal de Detalhes / Resumo da Conexão Selecionada */}
      {summaryConn && (
        <Dialog open={!!summaryConn} onOpenChange={(o) => !o && setSummaryConn(null)}>
          <DialogContent className="max-w-md p-5 bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-sm font-bold text-[#272727] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0C1BA8]" />
                {pt ? "Resumo da Conexão entre Processos" : "Connection Summary"}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-3 space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-lg space-y-2 border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">{pt ? "Tipo de Relação:" : "Relationship Type:"}</span>
                  <Badge className="bg-purple-100 text-purple-800 border-0 font-semibold text-[10px]">
                    {RELATIONSHIP_LABELS[summaryConn.relationshipType]?.pt || summaryConn.relationshipType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">{pt ? "Origem (Predecessor):" : "Source (Predecessor):"}</span>
                  <span className="font-bold text-[#272727] text-right">{summaryConn.sourceProcessName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">{pt ? "Destino (Sucessor):" : "Target (Successor):"}</span>
                  <span className="font-bold text-[#272727] text-right">{summaryConn.targetProcessName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-medium">{pt ? "Status da Conexão:" : "Validation Status:"}</span>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      summaryConn.validationStatus === "validada"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {summaryConn.validationStatus === "validada" ? "Validada" : "Pendente de Validação"}
                  </Badge>
                </div>
              </div>

              {summaryConn.transferredObject && (
                <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-100">
                  <span className="text-[10px] font-bold text-blue-900 block mb-0.5">
                    {pt ? "Objeto / Insumo Transferido:" : "Transferred Object:"}
                  </span>
                  <p className="text-gray-800 font-medium">{summaryConn.transferredObject}</p>
                </div>
              )}

              {summaryConn.relatedSystem && (
                <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500">{pt ? "Sistema Integrado:" : "System:"}</span>
                  <span className="font-bold text-gray-800">{summaryConn.relatedSystem}</span>
                </div>
              )}

              {summaryConn.description && (
                <div>
                  <span className="text-gray-500 font-medium block mb-1">{pt ? "Descrição do Handoff:" : "Description:"}</span>
                  <p className="text-gray-700 bg-gray-50 p-2 rounded border border-gray-100 text-[11px] leading-relaxed">
                    {summaryConn.description}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => setSummaryConn(null)}>
                {pt ? "Fechar" : "Close"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
