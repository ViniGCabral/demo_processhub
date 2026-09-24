import React, { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Trash2,
  Star,
  StarOff,
  ChevronDown,
  Play,
  Square,
  Diamond,
  GripVertical,
  ArrowRight,
  Save,
  X,
  Pencil,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  useProcessFlowStore,
  ProcessFlow,
  FlowNode,
  FlowConnection,
  FlowNodeType,
} from "@/stores/processFlowStore";

// ── Props ──────────────────────────────────────────────────────

interface ProcessFlowEditorProps {
  /** The architecture node ID at the last level */
  parentNodeId: string;
  /** Display name for this architecture node */
  parentNodeName: string;
  /** Available processes at this level that can be added as activities */
  availableProcesses: { id: string; name: string; description?: string }[];
  /** Whether this panel is currently visible */
  visible: boolean;
}

// ── Sub-components ─────────────────────────────────────────────

/** Visual node rendering inside the flow */
function FlowNodeCard({
  node,
  processName,
  isEditing,
  onRemove,
}: {
  node: FlowNode;
  processName?: string;
  isEditing: boolean;
  onRemove?: () => void;
}) {
  const label = node.type === "activity" ? processName || node.label : node.label;

  if (node.type === "start") {
    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#22C55E] flex items-center justify-center shadow-md shadow-green-200/50">
          <Play className="h-4 w-4 text-white fill-white ml-0.5" />
        </div>
        <span className="text-[10px] font-medium text-[#4D5A72] uppercase tracking-wide">
          {label}
        </span>
      </div>
    );
  }

  if (node.type === "end") {
    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0">
        <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center shadow-md shadow-red-200/50 ring-2 ring-red-200">
          <Square className="h-3.5 w-3.5 text-white fill-white" />
        </div>
        <span className="text-[10px] font-medium text-[#4D5A72] uppercase tracking-wide">
          {label}
        </span>
      </div>
    );
  }

  if (node.type === "gateway") {
    return (
      <div className="flex flex-col items-center gap-1.5 shrink-0 group relative">
        <div className="w-10 h-10 rotate-45 bg-[#F59E0B] flex items-center justify-center shadow-md shadow-amber-200/50 rounded-sm">
          <span className="text-white font-bold text-sm -rotate-45">✕</span>
        </div>
        <span className="text-[10px] font-medium text-[#4D5A72] uppercase tracking-wide max-w-[80px] text-center truncate">
          {label}
        </span>
        {isEditing && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  // activity
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 group relative max-w-[180px]">
      <div className="w-full min-w-[140px] bg-white border-2 border-[#1a4fd6]/30 rounded-lg px-3 py-2.5 shadow-sm hover:shadow-md transition-shadow hover:border-[#1a4fd6]/60">
        <div className="text-[10px] font-bold text-[#1a4fd6] uppercase tracking-wider mb-0.5 opacity-70">
          Processo
        </div>
        <div className="text-[12px] font-semibold text-[#1A2A48] leading-snug line-clamp-3">
          {label}
        </div>
      </div>
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  );
}

/** Arrow connector between nodes */
function FlowArrow() {
  return (
    <div className="flex items-center px-1 shrink-0">
      <div className="w-8 h-[2px] bg-[#CBD5E1]" />
      <ArrowRight className="h-3.5 w-3.5 text-[#94A3B8] -ml-1" />
    </div>
  );
}

/** Add node button between existing nodes */
function AddNodeButton({
  onAddActivity,
  onAddGateway,
  availableProcesses,
  usedProcessIds,
}: {
  onAddActivity: (processId: string) => void;
  onAddGateway: () => void;
  availableProcesses: { id: string; name: string }[];
  usedProcessIds: Set<string>;
}) {
  const [open, setOpen] = useState(false);
  const { language } = useLanguage();
  const pt = language === "PT";

  const unusedProcesses = availableProcesses.filter(
    (p) => !usedProcessIds.has(p.id)
  );

  return (
    <div className="flex items-center px-0.5 shrink-0">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button className="w-7 h-7 rounded-full border-2 border-dashed border-[#94A3B8] hover:border-[#1a4fd6] hover:bg-[#EEF2FF] flex items-center justify-center transition-all group">
            <Plus className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#1a4fd6]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64 max-h-[320px] overflow-y-auto">
          <div className="px-2 py-1.5 text-[10px] font-bold text-[#7C889E] uppercase tracking-wider">
            {pt ? "Processos disponíveis" : "Available processes"}
          </div>
          {unusedProcesses.length === 0 && (
            <div className="px-3 py-2 text-xs text-muted-foreground italic">
              {pt
                ? "Todos os processos já foram adicionados"
                : "All processes already added"}
            </div>
          )}
          {unusedProcesses.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onClick={() => {
                onAddActivity(p.id);
                setOpen(false);
              }}
              className="text-xs"
            >
              <div className="w-2 h-2 rounded-full bg-[#1a4fd6] mr-2 shrink-0" />
              {p.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              onAddGateway();
              setOpen(false);
            }}
            className="text-xs"
          >
            <Diamond className="h-3.5 w-3.5 mr-2 text-[#F59E0B]" />
            {pt ? "Gateway (decisão XOR)" : "Gateway (XOR decision)"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────

export function ProcessFlowEditor({
  parentNodeId,
  parentNodeName,
  availableProcesses,
  visible,
}: ProcessFlowEditorProps) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const {
    getFlows,
    getDefaultFlow,
    createFlow,
    updateFlow,
    deleteFlow,
    setDefaultFlow,
    clearDefault,
    replaceFlowContent,
  } = useProcessFlowStore();

  const flows = getFlows(parentNodeId);
  const defaultFlow = getDefaultFlow(parentNodeId);

  const [selectedFlowId, setSelectedFlowId] = useState<string | null>(
    defaultFlow?.id || flows[0]?.id || null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editNodes, setEditNodes] = useState<FlowNode[]>([]);
  const [editConnections, setEditConnections] = useState<FlowConnection[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editInfoDialogOpen, setEditInfoDialogOpen] = useState(false);
  const [newFlowName, setNewFlowName] = useState("");
  const [newFlowDesc, setNewFlowDesc] = useState("");

  const selectedFlow = useMemo(() => {
    if (!selectedFlowId) return null;
    return flows.find((f) => f.id === selectedFlowId) || null;
  }, [flows, selectedFlowId]);

  const displayNodes = useMemo(() => {
    if (isEditing) return [...editNodes].sort((a, b) => a.order - b.order);
    if (!selectedFlow) return [];
    return [...selectedFlow.nodes].sort((a, b) => a.order - b.order);
  }, [isEditing, editNodes, selectedFlow]);

  const usedProcessIds = useMemo(() => {
    const nodes = isEditing ? editNodes : selectedFlow?.nodes || [];
    return new Set(
      nodes.filter((n) => n.type === "activity" && n.processId).map((n) => n.processId!)
    );
  }, [isEditing, editNodes, selectedFlow]);

  const processMap = useMemo(() => {
    const map = new Map<string, string>();
    availableProcesses.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [availableProcesses]);

  // ── Handlers ───────────────────────

  const handleCreate = () => {
    if (!newFlowName.trim()) return;
    const flow = createFlow(parentNodeId, newFlowName.trim(), newFlowDesc.trim() || undefined);
    setSelectedFlowId(flow.id);
    setNewFlowName("");
    setNewFlowDesc("");
    setCreateDialogOpen(false);
    toast.success(pt ? "Fluxo criado com sucesso" : "Flow created successfully");
  };

  const handleDelete = () => {
    if (!selectedFlowId) return;
    deleteFlow(selectedFlowId);
    const remaining = flows.filter((f) => f.id !== selectedFlowId);
    setSelectedFlowId(remaining[0]?.id || null);
    setDeleteDialogOpen(false);
    setIsEditing(false);
    toast.success(pt ? "Fluxo excluído" : "Flow deleted");
  };

  const startEditing = () => {
    if (!selectedFlow) return;
    setEditNodes([...selectedFlow.nodes]);
    setEditConnections([...selectedFlow.connections]);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditNodes([]);
    setEditConnections([]);
  };

  const saveEditing = () => {
    if (!selectedFlowId) return;
    replaceFlowContent(selectedFlowId, editNodes, rebuildConnections(editNodes));
    setIsEditing(false);
    toast.success(pt ? "Fluxo salvo" : "Flow saved");
  };

  const handleUpdateInfo = () => {
    if (!selectedFlowId) return;
    updateFlow(selectedFlowId, {
      name: newFlowName.trim() || selectedFlow?.name,
      description: newFlowDesc.trim() || undefined,
    });
    setEditInfoDialogOpen(false);
    toast.success(pt ? "Informações atualizadas" : "Info updated");
  };

  const handleToggleDefault = () => {
    if (!selectedFlowId) return;
    if (selectedFlow?.isDefault) {
      clearDefault(parentNodeId);
      toast.info(pt ? "Visualização padrão removida" : "Default view cleared");
    } else {
      setDefaultFlow(parentNodeId, selectedFlowId);
      toast.success(pt ? "Definido como visualização padrão" : "Set as default view");
    }
  };

  // Insert node between existing nodes in editor mode
  const insertNodeAt = (afterIndex: number, type: FlowNodeType, processId?: string) => {
    const genId = () => Math.random().toString(36).slice(2, 11);
    const label =
      type === "gateway"
        ? "Gateway"
        : processId
          ? processMap.get(processId) || "Processo"
          : "Processo";

    const newNode: FlowNode = {
      id: genId(),
      type,
      processId,
      label,
      order: afterIndex + 0.5,
    };

    const updated = [...editNodes, newNode].sort((a, b) => a.order - b.order);
    // re-index orders
    updated.forEach((n, i) => (n.order = i));
    setEditNodes(updated);
    setEditConnections(rebuildConnections(updated));
  };

  const removeEditNode = (nodeId: string) => {
    const updated = editNodes.filter((n) => n.id !== nodeId);
    updated.forEach((n, i) => (n.order = i));
    setEditNodes(updated);
    setEditConnections(rebuildConnections(updated));
  };

  // Rebuild sequential connections from ordered node list
  const rebuildConnections = (nodes: FlowNode[]): FlowConnection[] => {
    const sorted = [...nodes].sort((a, b) => a.order - b.order);
    const conns: FlowConnection[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      conns.push({
        id: Math.random().toString(36).slice(2, 11),
        sourceNodeId: sorted[i].id,
        targetNodeId: sorted[i + 1].id,
      });
    }
    return conns;
  };

  if (!visible) return null;

  // ── Render ─────────────────────────

  return (
    <div className="w-full">
      {/* ── Header: dropdown + actions ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <GitBranch className="h-5 w-5 text-[#1a4fd6]" />
          <h3 className="text-sm font-bold text-[#1A2A48]">
            {pt ? "Fluxos de Processo" : "Process Flows"}
          </h3>

          {flows.length > 0 && (
            <Select
              value={selectedFlowId || ""}
              onValueChange={(v) => {
                if (isEditing) {
                  toast.warning(
                    pt
                      ? "Salve ou cancele a edição antes de trocar de fluxo"
                      : "Save or cancel editing before switching flows"
                  );
                  return;
                }
                setSelectedFlowId(v);
              }}
            >
              <SelectTrigger className="h-8 w-[260px] text-xs border-[#DFE5EF]">
                <SelectValue
                  placeholder={pt ? "Selecionar fluxo..." : "Select flow..."}
                />
              </SelectTrigger>
              <SelectContent>
                {flows.map((f) => (
                  <SelectItem key={f.id} value={f.id} className="text-xs">
                    <div className="flex items-center gap-2">
                      {f.isDefault && (
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                      )}
                      {f.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="flex items-center gap-2">
          {selectedFlow && !isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-[#1a4fd6]"
                onClick={handleToggleDefault}
              >
                {selectedFlow.isDefault ? (
                  <>
                    <Star className="h-3.5 w-3.5 mr-1 fill-amber-500 text-amber-500" />
                    {pt ? "Padrão" : "Default"}
                  </>
                ) : (
                  <>
                    <StarOff className="h-3.5 w-3.5 mr-1" />
                    {pt ? "Definir padrão" : "Set default"}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] border-[#DFE5EF]"
                onClick={() => {
                  setNewFlowName(selectedFlow.name);
                  setNewFlowDesc(selectedFlow.description || "");
                  setEditInfoDialogOpen(true);
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />
                {pt ? "Info" : "Info"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] border-[#1a4fd6]/30 text-[#1a4fd6] hover:bg-[#EEF2FF]"
                onClick={startEditing}
              >
                <Pencil className="h-3 w-3 mr-1" />
                {pt ? "Editar fluxo" : "Edit flow"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-red-500 hover:bg-red-50"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-3 w-3 mr-1" />
              </Button>
            </>
          )}

          {isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px]"
                onClick={cancelEditing}
              >
                <X className="h-3 w-3 mr-1" />
                {pt ? "Cancelar" : "Cancel"}
              </Button>
              <Button
                size="sm"
                className="h-7 text-[11px] bg-[#1a4fd6] hover:bg-[#1539b0]"
                onClick={saveEditing}
              >
                <Save className="h-3 w-3 mr-1" />
                {pt ? "Salvar" : "Save"}
              </Button>
            </>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-7 text-[11px] border-[#DFE5EF]"
            onClick={() => {
              setNewFlowName("");
              setNewFlowDesc("");
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="h-3 w-3 mr-1" />
            {pt ? "Novo fluxo" : "New flow"}
          </Button>
        </div>
      </div>

      {/* ── Flow visualization ── */}
      {selectedFlow || isEditing ? (
        <div className="bg-gradient-to-br from-[#F8FAFD] to-[#F1F5FB] border border-[#DFE5EF] rounded-xl p-6 shadow-inner overflow-x-auto">
          {/* Flow name */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-[#263754]">
              {selectedFlow?.name}
            </h4>
            {selectedFlow?.description && (
              <p className="text-[11px] text-[#7C889E] mt-0.5">
                {selectedFlow.description}
              </p>
            )}
          </div>

          {/* Horizontal flow */}
          <div className="flex items-center gap-0 min-w-max pb-2">
            {displayNodes.map((node, idx) => {
              const isStart = node.type === "start";
              const isEnd = node.type === "end";

              return (
                <React.Fragment key={node.id}>
                  {/* Add button before each non-start node when editing */}
                  {isEditing && !isStart && (
                    <>
                      <FlowArrow />
                      <AddNodeButton
                        onAddActivity={(processId) =>
                          insertNodeAt(idx - 1, "activity", processId)
                        }
                        onAddGateway={() => insertNodeAt(idx - 1, "gateway")}
                        availableProcesses={availableProcesses}
                        usedProcessIds={usedProcessIds}
                      />
                    </>
                  )}

                  {/* Arrow before non-start nodes in view mode */}
                  {!isEditing && idx > 0 && <FlowArrow />}

                  <FlowNodeCard
                    node={node}
                    processName={
                      node.processId ? processMap.get(node.processId) : undefined
                    }
                    isEditing={isEditing}
                    onRemove={
                      !isStart && !isEnd
                        ? () => removeEditNode(node.id)
                        : undefined
                    }
                  />
                </React.Fragment>
              );
            })}
          </div>

          {isEditing && (
            <div className="mt-4 pt-3 border-t border-[#DFE5EF]/60">
              <p className="text-[10px] text-[#94A3B8] italic">
                {pt
                  ? "Clique em (+) entre as etapas para inserir processos ou gateways. Passe o mouse sobre um elemento para removê-lo."
                  : "Click (+) between steps to insert processes or gateways. Hover over an element to remove it."}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Empty state */
        <div className="bg-[#F8FAFD] border border-dashed border-[#CBD5E1] rounded-xl p-10 flex flex-col items-center justify-center">
          <GitBranch className="h-10 w-10 text-[#CBD5E1] mb-3" />
          <p className="text-sm font-medium text-[#7C889E] mb-1">
            {pt ? "Nenhum fluxo criado" : "No flows created"}
          </p>
          <p className="text-[11px] text-[#94A3B8] mb-4 text-center max-w-sm">
            {pt
              ? "Crie um fluxo de processo para visualizar a sequência das etapas deste domínio."
              : "Create a process flow to visualize the step sequence of this domain."}
          </p>
          <Button
            variant="outline"
            size="sm"
            className="text-[11px]"
            onClick={() => {
              setNewFlowName("");
              setNewFlowDesc("");
              setCreateDialogOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" />
            {pt ? "Criar primeiro fluxo" : "Create first flow"}
          </Button>
        </div>
      )}

      {/* ── Create flow dialog ── */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pt ? "Novo Fluxo de Processo" : "New Process Flow"}
            </DialogTitle>
            <DialogDescription>
              {pt
                ? `Crie um fluxo para "${parentNodeName}". Depois de criar, adicione as etapas editando o fluxo.`
                : `Create a flow for "${parentNodeName}". After creating, add steps by editing the flow.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                {pt ? "Nome do fluxo *" : "Flow name *"}
              </label>
              <Input
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                placeholder={
                  pt ? "Ex.: Fluxo principal de conceituação" : "E.g. Main conceptualization flow"
                }
                className="text-sm"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                {pt ? "Descrição (opcional)" : "Description (optional)"}
              </label>
              <Textarea
                value={newFlowDesc}
                onChange={(e) => setNewFlowDesc(e.target.value)}
                placeholder={pt ? "Breve descrição do fluxo..." : "Brief flow description..."}
                className="text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)}>
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newFlowName.trim()}
              className="bg-[#1a4fd6] hover:bg-[#1539b0]"
            >
              <Plus className="h-4 w-4 mr-1" />
              {pt ? "Criar fluxo" : "Create flow"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Edit info dialog ── */}
      <Dialog open={editInfoDialogOpen} onOpenChange={setEditInfoDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {pt ? "Editar Informações do Fluxo" : "Edit Flow Info"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                {pt ? "Nome" : "Name"}
              </label>
              <Input
                value={newFlowName}
                onChange={(e) => setNewFlowName(e.target.value)}
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                {pt ? "Descrição" : "Description"}
              </label>
              <Textarea
                value={newFlowDesc}
                onChange={(e) => setNewFlowDesc(e.target.value)}
                className="text-sm resize-none"
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditInfoDialogOpen(false)}>
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={handleUpdateInfo} className="bg-[#1a4fd6] hover:bg-[#1539b0]">
              <Save className="h-4 w-4 mr-1" />
              {pt ? "Salvar" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ── */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pt ? "Excluir fluxo?" : "Delete flow?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pt
                ? `O fluxo "${selectedFlow?.name}" será excluído permanentemente. Essa ação não pode ser desfeita.`
                : `The flow "${selectedFlow?.name}" will be permanently deleted. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{pt ? "Cancelar" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              {pt ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
