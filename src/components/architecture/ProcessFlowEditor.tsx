import React, { useState, useMemo, useCallback, useEffect } from "react";
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
  Split,
  Check,
  SlidersHorizontal,
  Info,
  TableProperties,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  FlowBranch,
  FlowConnection,
  FlowNodeType,
} from "@/stores/processFlowStore";
import { useRaciStore, RaciRow } from "@/stores/raciStore";
import { RaciMatrixModal } from "./modals/RaciMatrixModal";
import { useNavigate } from "react-router-dom";
import { ProcessData } from "@/stores/processStore";
import { ProcessActionDialog } from "./modals/ProcessActionDialog";
import { ProcessConnectionMapModal } from "@/components/process/connections/ProcessConnectionMapModal";

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
  /** Callback when a process activity is selected */
  onSelectProcess?: (process: ProcessData) => void;
}

// ── Sub-components ─────────────────────────────────────────────

// ── RACI Types & Helpers ─────────────────────────────────────

export interface ProcessRaciRoleItem {
  area: string;
  note?: string;
}

export interface ProcessRaciSummary {
  rowId: string;
  procedureName: string;
  subDetail?: string;
  r: ProcessRaciRoleItem[]; // Responsável
  a: ProcessRaciRoleItem[]; // Aprovador / Autorizado
  c: ProcessRaciRoleItem[]; // Consultado
  i: ProcessRaciRoleItem[]; // Informado
  totalCount: number;
}

function formatRaciAreas(items: ProcessRaciRoleItem[]): string {
  if (items.length === 0) return "-";
  if (items.length <= 2) {
    return items.map((x) => x.area).join(", ");
  }
  return `${items.slice(0, 2).map((x) => x.area).join(", ")} +${items.length - 2}`;
}

/** Visual node rendering inside the flow */
function FlowNodeCard({
  node,
  processName,
  isEditing,
  onRemove,
  raciData,
  onSplitGateway,
  onRename,
  onSelect,
}: {
  node: FlowNode;
  processName?: string;
  isEditing: boolean;
  onRemove?: () => void;
  raciData?: ProcessRaciSummary;
  onSplitGateway?: () => void;
  onRename?: (newLabel: string) => void;
  onSelect?: () => void;
}) {
  const [editingLabel, setEditingLabel] = useState(false);
  const [labelInput, setLabelInput] = useState(node.label);

  const label = node.type === "activity" ? processName || node.label : node.label;

  const saveLabel = () => {
    if (labelInput.trim() && onRename) {
      onRename(labelInput.trim());
    }
    setEditingLabel(false);
  };

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
      <div className="flex flex-col items-center gap-1.5 shrink-0 group relative">
        <div className="w-10 h-10 rounded-full bg-[#EF4444] flex items-center justify-center shadow-md shadow-red-200/50 ring-2 ring-red-200">
          <Square className="h-3.5 w-3.5 text-white fill-white" />
        </div>
        {editingLabel ? (
          <input
            type="text"
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
            onBlur={saveLabel}
            onKeyDown={(e) => e.key === "Enter" && saveLabel()}
            className="text-[10px] font-bold text-[#4D5A72] text-center border border-[#1a4fd6] rounded px-1 py-0.5 mt-1 w-24 outline-none"
            autoFocus
          />
        ) : (
          <span
            onClick={() => {
              if (isEditing && onRename) {
                setLabelInput(node.label);
                setEditingLabel(true);
              }
            }}
            className={cn(
              "text-[10px] font-medium text-[#4D5A72] uppercase tracking-wide max-w-[100px] text-center truncate",
              isEditing && onRename && "cursor-pointer hover:text-[#1a4fd6] hover:underline"
            )}
            title={label}
          >
            {label}
          </span>
        )}
        {isEditing && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
            title="Remover evento de fim"
          >
            <X className="h-3 w-3" />
          </button>
        )}
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
        {isEditing && (
          <div className="flex flex-col items-center gap-1 mt-1">
            <button
              onClick={onSplitGateway}
              className="text-[10px] font-bold text-[#1a4fd6] bg-[#EEF2FF] hover:bg-[#E0E7FF] border border-[#1a4fd6]/20 px-2 py-0.5 rounded-md flex items-center gap-1 transition-all shadow-xs shrink-0 whitespace-nowrap cursor-pointer"
              title="Dividir fluxo em dois caminhos paralelos"
            >
              <GitBranch className="h-3 w-3" />
              <span>Dividir em 2 caminhos</span>
            </button>
          </div>
        )}
        {isEditing && onRemove && (
          <button
            onClick={onRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    );
  }

  // activity
  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0 group relative max-w-[210px]">
      <div
        onClick={() => {
          if (!isEditing && onSelect) {
            onSelect();
          }
        }}
        className={cn(
          "w-full min-w-[170px] max-w-[210px] bg-white border border-[#DFE5EF] hover:border-[#1a4fd6]/60 rounded-xl px-3.5 py-3 shadow-[0_2px_8px_rgba(20,35,70,0.04)] hover:shadow-md transition-all",
          !isEditing && "cursor-pointer hover:border-[#1a4fd6] hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 select-none"
        )}
      >
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-bold text-[#1a4fd6] uppercase tracking-wider opacity-90">
            Processo
          </span>
          {raciData && raciData.totalCount > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="text-[#94A3B8] hover:text-[#1a4fd6] p-0.5 rounded hover:bg-[#EEF2FF] transition-colors"
                  title="Ver detalhes da Matriz RACI"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Info className="h-3.5 w-3.5" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-80 p-3.5 bg-white shadow-xl border border-[#DFE5EF] rounded-xl text-left z-50">
                <div className="flex items-start justify-between border-b border-[#DFE5EF]/80 pb-2 mb-2.5">
                  <div>
                    <div className="text-[10px] font-bold text-[#1a4fd6] uppercase tracking-wider">
                      Matriz RACI · Atribuições
                    </div>
                    <div className="text-xs font-bold text-[#1A2A48] mt-0.5">
                      {raciData.procedureName}
                    </div>
                    {raciData.subDetail && (
                      <div className="text-[10px] text-[#64748B] italic mt-0.5">
                        {raciData.subDetail}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2.5">
                  {/* R */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded bg-[#EEF2FF] text-[#1a4fd6] font-bold text-[9px] flex items-center justify-center border border-[#1a4fd6]/25">
                        R
                      </span>
                      <span className="text-[11px] font-bold text-[#1A2A48]">Responsável</span>
                      <span className="text-[10px] text-[#64748B] font-normal">(Executa)</span>
                    </div>
                    {raciData.r.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pl-5">
                        {raciData.r.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#EEF2FF] text-[#1a4fd6] px-1.5 py-0.5 rounded font-medium border border-[#1a4fd6]/15">
                            {item.area}
                            {item.note && <span className="text-[9px] text-[#1a4fd6]/70 italic">({item.note})</span>}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic pl-5">Nenhum</span>
                    )}
                  </div>

                  {/* A */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded bg-[#F5F3FF] text-[#7C3AED] font-bold text-[9px] flex items-center justify-center border border-[#7C3AED]/25">
                        A
                      </span>
                      <span className="text-[11px] font-bold text-[#1A2A48]">Aprovador / Autorizado</span>
                      <span className="text-[10px] text-[#64748B] font-normal">(Valida)</span>
                    </div>
                    {raciData.a.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pl-5">
                        {raciData.a.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#F5F3FF] text-[#7C3AED] px-1.5 py-0.5 rounded font-medium border border-[#7C3AED]/15">
                            {item.area}
                            {item.note && <span className="text-[9px] text-[#7C3AED]/70 italic">({item.note})</span>}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic pl-5">Nenhum</span>
                    )}
                  </div>

                  {/* C */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded bg-[#FFFBEB] text-[#D97706] font-bold text-[9px] flex items-center justify-center border border-[#D97706]/25">
                        C
                      </span>
                      <span className="text-[11px] font-bold text-[#1A2A48]">Consultado</span>
                      <span className="text-[10px] text-[#64748B] font-normal">(Opina)</span>
                    </div>
                    {raciData.c.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pl-5">
                        {raciData.c.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#FFFBEB] text-[#B45309] px-1.5 py-0.5 rounded font-medium border border-[#F59E0B]/20">
                            {item.area}
                            {item.note && <span className="text-[9px] text-[#B45309]/80 italic">({item.note})</span>}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic pl-5">Nenhum</span>
                    )}
                  </div>

                  {/* I */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-4 h-4 rounded bg-[#F8FAFC] text-[#64748B] font-bold text-[9px] flex items-center justify-center border border-[#CBD5E1]">
                        I
                      </span>
                      <span className="text-[11px] font-bold text-[#1A2A48]">Informado</span>
                      <span className="text-[10px] text-[#64748B] font-normal">(Notificado)</span>
                    </div>
                    {raciData.i.length > 0 ? (
                      <div className="flex flex-wrap gap-1 pl-5">
                        {raciData.i.map((item, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 text-[10px] bg-[#F1F5F9] text-[#475569] px-1.5 py-0.5 rounded font-medium border border-slate-200">
                            {item.area}
                            {item.note && <span className="text-[9px] text-slate-500 italic">({item.note})</span>}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground italic pl-5">Nenhum</span>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="text-[12px] font-semibold text-[#1A2A48] leading-snug line-clamp-3">
          {label}
        </div>

        {/* Clean, compact RACI roles section */}
        {raciData && raciData.totalCount > 0 && (
          <div className="mt-2.5 pt-2 border-t border-[#DFE5EF]/70 flex flex-col gap-1">
            {/* R - Responsável */}
            {raciData.r.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px]" title={`Responsável: ${raciData.r.map(x => x.area + (x.note ? ` (${x.note})` : '')).join(', ')}`}>
                <span className="w-4 h-4 rounded bg-[#EEF2FF] text-[#1a4fd6] font-bold text-[9px] flex items-center justify-center shrink-0 border border-[#1a4fd6]/25">
                  R
                </span>
                <span className="text-[#1A2A48] font-medium text-[10px] truncate">
                  {formatRaciAreas(raciData.r)}
                </span>
              </div>
            )}

            {/* A - Aprovador */}
            {raciData.a.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px]" title={`Aprovador: ${raciData.a.map(x => x.area + (x.note ? ` (${x.note})` : '')).join(', ')}`}>
                <span className="w-4 h-4 rounded bg-[#F5F3FF] text-[#7C3AED] font-bold text-[9px] flex items-center justify-center shrink-0 border border-[#7C3AED]/25">
                  A
                </span>
                <span className="text-[#1A2A48] font-medium text-[10px] truncate">
                  {formatRaciAreas(raciData.a)}
                </span>
              </div>
            )}

            {/* C - Consultado */}
            {raciData.c.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px]" title={`Consultado: ${raciData.c.map(x => x.area + (x.note ? ` (${x.note})` : '')).join(', ')}`}>
                <span className="w-4 h-4 rounded bg-[#FFFBEB] text-[#D97706] font-bold text-[9px] flex items-center justify-center shrink-0 border border-[#D97706]/25">
                  C
                </span>
                <span className="text-[#475569] font-medium text-[10px] truncate">
                  {formatRaciAreas(raciData.c)}
                </span>
              </div>
            )}

            {/* I - Informado */}
            {raciData.i.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px]" title={`Informado: ${raciData.i.map(x => x.area + (x.note ? ` (${x.note})` : '')).join(', ')}`}>
                <span className="w-4 h-4 rounded bg-[#F8FAFC] text-[#64748B] font-bold text-[9px] flex items-center justify-center shrink-0 border border-[#CBD5E1]">
                  I
                </span>
                <span className="text-[#475569] font-medium text-[10px] truncate">
                  {formatRaciAreas(raciData.i)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {isEditing && onRemove && (
        <button
          onClick={onRemove}
          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
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

/** Add button to insert processes or an End event into a specific branch */
function AddBranchNodeButton({
  onAddActivity,
  onAddEnd,
  availableProcesses,
  usedProcessIds,
  branchLabel,
  branchHasEnd,
}: {
  onAddActivity: (processId: string) => void;
  onAddEnd: () => void;
  availableProcesses: { id: string; name: string }[];
  usedProcessIds: Set<string>;
  branchLabel?: string;
  branchHasEnd?: boolean;
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
          <button
            className="w-7 h-7 rounded-full border-2 border-dashed border-[#94A3B8] hover:border-[#1a4fd6] hover:bg-[#EEF2FF] flex items-center justify-center transition-all group cursor-pointer"
            title={pt ? `Adicionar etapa em "${branchLabel || 'caminho'}"` : `Add step to "${branchLabel || 'branch'}"`}
          >
            <Plus className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#1a4fd6]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-68 max-h-[340px] overflow-y-auto">
          <div className="px-2 py-1.5 text-[10px] font-bold text-[#7C889E] uppercase tracking-wider">
            {pt ? `Adicionar em: ${branchLabel || "Caminho"}` : `Add to: ${branchLabel || "Branch"}`}
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
              className="text-xs cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[#1a4fd6] mr-2 shrink-0" />
              {p.name}
            </DropdownMenuItem>
          ))}

          {!branchHasEnd && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onAddEnd();
                  setOpen(false);
                }}
                className="text-xs text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-medium"
              >
                <Square className="h-3.5 w-3.5 mr-2 fill-red-500" />
                {pt ? "Finalizar caminho (Evento de Fim)" : "End this branch (End event)"}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** Right-side connector depending on whether branches converge or end independently */
function ForkExitConnector({
  branches,
  totalHeight,
  centerY,
  branchYs,
  pt,
}: {
  branches: FlowBranch[];
  totalHeight: number;
  centerY: number;
  branchYs: number[];
  pt: boolean;
}) {
  // Case 1: All branches end independently -> no convergence join!
  const allEnd = branches.every((b) => b.nodes.some((n) => n.type === "end"));
  if (allEnd) {
    return null;
  }

  const continuingIndices = branches
    .map((b, idx) => ({ branch: b, idx }))
    .filter(({ branch }) => !branch.nodes.some((n) => n.type === "end"))
    .map(({ idx }) => idx);

  if (continuingIndices.length === 0) {
    return null;
  }

  // Case 2: Only 1 branch continues (others ended)
  if (continuingIndices.length === 1) {
    const onlyIdx = continuingIndices[0];
    const onlyY = branchYs[onlyIdx];
    return (
      <div className="flex items-center shrink-0 pl-1">
        <div style={{ height: `${totalHeight}px` }} className="w-8 flex items-center justify-center shrink-0 -mx-1">
          <svg
            className="w-8 text-[#CBD5E1]"
            style={{ height: `${totalHeight}px` }}
            viewBox={`0 0 32 ${totalHeight}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d={`M 0 ${onlyY} C 16 ${onlyY}, 16 ${centerY}, 32 ${centerY}`} />
          </svg>
        </div>
        <div className="flex flex-col items-center justify-center shrink-0 pr-1">
          <span className="text-[9px] font-semibold text-emerald-700 uppercase tracking-wider bg-white border border-emerald-300 px-2 py-0.5 rounded-full shadow-2xs">
            {pt ? "Continua" : "Continues"}
          </span>
        </div>
      </div>
    );
  }

  // Case 3: Multiple branches converge into Join Gateway
  return (
    <>
      <div style={{ height: `${totalHeight}px` }} className="w-8 flex items-center justify-center shrink-0 -mx-1">
        <svg
          className="w-8 text-[#CBD5E1]"
          style={{ height: `${totalHeight}px` }}
          viewBox={`0 0 32 ${totalHeight}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {continuingIndices.map((cIdx) => (
            <path
              key={cIdx}
              d={`M 0 ${branchYs[cIdx]} C 16 ${branchYs[cIdx]}, 16 ${centerY}, 32 ${centerY}`}
            />
          ))}
        </svg>
      </div>
      <div className="flex flex-col items-center justify-center shrink-0 pl-2">
        <div className="w-8 h-8 rotate-45 bg-[#F59E0B]/20 border-2 border-[#F59E0B] flex items-center justify-center shadow-xs rounded-sm">
          <span className="text-[#D97706] font-bold text-xs -rotate-45">⤡</span>
        </div>
        <span className="text-[9px] font-semibold text-[#7C889E] uppercase tracking-wider mt-1.5">
          {pt ? "Convergência" : "Join"}
        </span>
      </div>
    </>
  );
}

/** Dynamic N-branch visual component for split gateways (Clean, without outer colored boxes) */
function GatewayBranchView({
  node,
  isEditing,
  availableProcesses,
  usedProcessIds,
  processMap,
  getProcessRaciData,
  onRemoveGateway,
  onUnsplitGateway,
  onAddBranchNode,
  onAddBranchEnd,
  onRemoveBranchNode,
  onRenameBranch,
  onRenameGateway,
  onRenameBranchNode,
  onToggleBranchEnds,
  onAddBranch,
  onRemoveBranch,
  onSelectNode,
}: {
  node: FlowNode;
  isEditing: boolean;
  availableProcesses: { id: string; name: string }[];
  usedProcessIds: Set<string>;
  processMap: Map<string, string>;
  getProcessRaciData: (id?: string, name?: string) => ProcessRaciSummary | undefined;
  onRemoveGateway: (nodeId: string) => void;
  onUnsplitGateway: (nodeId: string) => void;
  onAddBranchNode: (nodeId: string, branchId: string, processId: string) => void;
  onAddBranchEnd: (nodeId: string, branchId: string) => void;
  onRemoveBranchNode: (nodeId: string, branchId: string, childId: string) => void;
  onRenameBranch: (nodeId: string, branchId: string, newLabel: string) => void;
  onRenameGateway: (nodeId: string, newLabel: string) => void;
  onRenameBranchNode: (nodeId: string, branchId: string, childId: string, newLabel: string) => void;
  onToggleBranchEnds: (nodeId: string) => void;
  onAddBranch?: (nodeId: string) => void;
  onRemoveBranch?: (nodeId: string, branchId: string) => void;
  onSelectNode?: (node: FlowNode) => void;
}) {
  const { language } = useLanguage();
  const pt = language === "PT";

  const branches = (node.branches && node.branches.length > 0)
    ? node.branches
    : [
        { id: "b1", label: pt ? "Sim" : "Yes", nodes: [] },
        { id: "b2", label: pt ? "Não" : "No", nodes: [] },
      ];

  const branchCount = Math.max(branches.length, 2);
  const rowHeight = 90;
  const totalHeight = branchCount * rowHeight;
  const centerY = totalHeight / 2;
  const branchYs = branches.map((_, idx) => (idx + 0.5) * (totalHeight / branchCount));

  const allEnd = branches.every((b) => b.nodes.some((n) => n.type === "end"));

  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [editingBranchLabel, setEditingBranchLabel] = useState("");
  const [editingGatewayLabel, setEditingGatewayLabel] = useState(false);
  const [gatewayLabelInput, setGatewayLabelInput] = useState(node.label || "Decisão XOR");

  const startEditBranch = (branchId: string, currentLabel: string) => {
    setEditingBranchId(branchId);
    setEditingBranchLabel(currentLabel);
  };

  const saveEditBranch = (branchId: string) => {
    if (editingBranchLabel.trim()) {
      onRenameBranch(node.id, branchId, editingBranchLabel.trim());
    }
    setEditingBranchId(null);
  };

  const saveEditGateway = () => {
    if (gatewayLabelInput.trim()) {
      onRenameGateway(node.id, gatewayLabelInput.trim());
    }
    setEditingGatewayLabel(false);
  };

  return (
    <div className="flex items-center gap-0 my-1 shrink-0 group/gateway relative">
      {/* Edit mode hover toolbar */}
      {isEditing && (
        <div className="absolute -top-7 left-2 flex items-center gap-2 bg-white border border-[#DFE5EF] px-2.5 py-0.5 rounded-md shadow-xs text-[10px] font-semibold text-[#7C889E] opacity-0 group-hover/gateway:opacity-100 transition-opacity z-20">
          <span className="text-amber-600 font-bold flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            {pt ? `${branches.length} Caminhos` : `${branches.length} Branches`}
          </span>
          <span className="text-[#CBD5E1]">·</span>

          {/* Add branch button */}
          <button
            onClick={() => onAddBranch?.(node.id)}
            className="text-[#1a4fd6] hover:text-[#1539b0] transition-colors flex items-center gap-1 cursor-pointer"
            title={pt ? "Adicionar caminho paralelo" : "Add parallel branch"}
          >
            <Plus className="h-2.5 w-2.5" />
            <span>{pt ? "Adicionar caminho" : "Add branch"}</span>
          </button>

          <span className="text-[#CBD5E1]">·</span>

          {/* Toggle Ends / Convergence shortcut */}
          <button
            onClick={() => onToggleBranchEnds(node.id)}
            className="text-[#1a4fd6] hover:text-[#1539b0] transition-colors flex items-center gap-1 cursor-pointer"
            title={allEnd ? "Remover fins próprios e fazer caminhos convergirem" : "Adicionar eventos de fim independentes em cada caminho"}
          >
            {allEnd ? (
              <>
                <span>⤡</span>
                <span>{pt ? "Fazer convergir" : "Converge"}</span>
              </>
            ) : (
              <>
                <Square className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                <span>{pt ? "Fins distintos" : "Distinct ends"}</span>
              </>
            )}
          </button>

          <span className="text-[#CBD5E1]">·</span>
          <button
            onClick={() => onUnsplitGateway(node.id)}
            className="hover:text-[#1a4fd6] transition-colors cursor-pointer"
            title={pt ? "Reverter para gateway linear" : "Revert to linear gateway"}
          >
            {pt ? "Unificar" : "Unify"}
          </button>
          <span className="text-[#CBD5E1]">·</span>
          <button
            onClick={() => onRemoveGateway(node.id)}
            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
            title={pt ? "Remover gateway" : "Delete gateway"}
          >
            {pt ? "Excluir" : "Delete"}
          </button>
        </div>
      )}

      {/* 1. Entrada / Decisão Gateway */}
      <div className="flex flex-col items-center justify-center shrink-0 pr-2 relative">
        <div className="w-10 h-10 rotate-45 bg-[#F59E0B] flex items-center justify-center shadow-md shadow-amber-200/50 rounded-sm">
          <span className="text-white font-bold text-sm -rotate-45">✕</span>
        </div>
        {editingGatewayLabel ? (
          <input
            type="text"
            value={gatewayLabelInput}
            onChange={(e) => setGatewayLabelInput(e.target.value)}
            onBlur={saveEditGateway}
            onKeyDown={(e) => e.key === "Enter" && saveEditGateway()}
            className="text-[10px] font-bold text-[#4D5A72] text-center border border-[#1a4fd6] rounded px-1 py-0.5 mt-2 w-24 outline-none"
            autoFocus
          />
        ) : (
          <div
            onClick={() => {
              if (isEditing) {
                setGatewayLabelInput(node.label || "Decisão XOR");
                setEditingGatewayLabel(true);
              }
            }}
            className={cn(
              "text-[10px] font-medium text-[#4D5A72] uppercase tracking-wide max-w-[90px] text-center truncate mt-2",
              isEditing && "cursor-pointer hover:text-[#1a4fd6] hover:underline"
            )}
            title={node.label || "Decisão XOR"}
          >
            {node.label || "Decisão XOR"}
          </div>
        )}
      </div>

      {/* 2. Fork Split Curves (SVG) */}
      <div
        style={{ height: `${totalHeight}px` }}
        className="w-8 flex items-center justify-center shrink-0 -mx-1"
      >
        <svg
          className="w-8 text-[#CBD5E1]"
          style={{ height: `${totalHeight}px` }}
          viewBox={`0 0 32 ${totalHeight}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {branchYs.map((by, idx) => (
            <path
              key={idx}
              d={`M 0 ${centerY} C 16 ${centerY}, 16 ${by}, 32 ${by}`}
            />
          ))}
        </svg>
      </div>

      {/* 3. The N Parallel Branches */}
      <div className="flex flex-col gap-4 py-1">
        {branches.map((branch, branchIdx) => {
          const branchHasEnd = branch.nodes.some((n) => n.type === "end");
          const badgeStyles = [
            "text-emerald-700 border-emerald-300 bg-white hover:bg-emerald-50",
            "text-blue-700 border-blue-300 bg-white hover:bg-blue-50",
            "text-amber-700 border-amber-300 bg-white hover:bg-amber-50",
            "text-purple-700 border-purple-300 bg-white hover:bg-purple-50",
            "text-indigo-700 border-indigo-300 bg-white hover:bg-indigo-50",
          ];
          const badgeColor = badgeStyles[branchIdx % badgeStyles.length];

          return (
            <div key={branch.id} className="flex items-center gap-2 min-h-[85px]">
              {/* Branch condition badge */}
              {editingBranchId === branch.id ? (
                <input
                  type="text"
                  value={editingBranchLabel}
                  onChange={(e) => setEditingBranchLabel(e.target.value)}
                  onBlur={() => saveEditBranch(branch.id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEditBranch(branch.id)}
                  className="text-[11px] font-bold text-slate-800 bg-white border border-[#1a4fd6] rounded px-1.5 py-0.5 w-24 outline-none"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => isEditing && startEditBranch(branch.id, branch.label)}
                  className={cn(
                    "flex items-center gap-1.5 shrink-0 border px-2.5 py-1 rounded-full text-[11px] font-bold shadow-2xs transition-all",
                    badgeColor,
                    isEditing && "cursor-pointer"
                  )}
                  title={isEditing ? (pt ? "Clique para editar o rótulo da condição" : "Click to edit condition label") : undefined}
                >
                  <span>{branch.label || `Caminho ${branchIdx + 1}`}</span>
                  {isEditing && <Pencil className="h-2.5 w-2.5 opacity-60 hover:opacity-100" />}
                </button>
              )}

              {/* Remove branch button if more than 2 branches */}
              {isEditing && branches.length > 2 && (
                <button
                  onClick={() => onRemoveBranch?.(node.id, branch.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer -ml-1"
                  title={pt ? "Remover este caminho" : "Remove this branch"}
                >
                  <X className="h-3 w-3" />
                </button>
              )}

              <FlowArrow />

              {/* Nodes in this branch */}
              {branch.nodes.map((bNode, bIdx) => (
                <React.Fragment key={bNode.id}>
                  {bIdx > 0 && <FlowArrow />}
                  <FlowNodeCard
                    node={bNode}
                    processName={bNode.processId ? processMap.get(bNode.processId) : bNode.label}
                    raciData={getProcessRaciData(bNode.processId, bNode.processId ? processMap.get(bNode.processId) : bNode.label)}
                    isEditing={isEditing}
                    onRemove={isEditing ? () => onRemoveBranchNode(node.id, branch.id, bNode.id) : undefined}
                    onRename={isEditing ? (newLabel) => onRenameBranchNode(node.id, branch.id, bNode.id, newLabel) : undefined}
                    onSelect={() => onSelectNode?.(bNode)}
                  />
                </React.Fragment>
              ))}

              {/* Empty state for branch */}
              {branch.nodes.length === 0 && (
                <div className="text-xs text-[#94A3B8] italic px-2">
                  {isEditing ? (
                    <span className="text-[11px] text-slate-500 font-medium">
                      {pt ? "Caminho direto (adicione etapas com +)" : "Direct path (add steps with +)"}
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      {pt ? "Fluxo direto" : "Direct flow"}
                    </span>
                  )}
                </div>
              )}

              {/* Add button inside branch (hidden if already ends with an End event) */}
              {isEditing && !branchHasEnd && (
                <>
                  <FlowArrow />
                  <AddBranchNodeButton
                    onAddActivity={(procId) => onAddBranchNode(node.id, branch.id, procId)}
                    onAddEnd={() => onAddBranchEnd(node.id, branch.id)}
                    availableProcesses={availableProcesses}
                    usedProcessIds={usedProcessIds}
                    branchLabel={branch.label}
                    branchHasEnd={branchHasEnd}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Right Exit Connector (Curves + Join or Direct End) */}
      <ForkExitConnector
        branches={branches}
        totalHeight={totalHeight}
        centerY={centerY}
        branchYs={branchYs}
        pt={pt}
      />
    </div>
  );
}

function AddNodeButton({
  onAddActivity,
  onAddGateway,
  onAddEnd,
  availableProcesses,
  usedProcessIds,
}: {
  onAddActivity: (processId: string) => void;
  onAddGateway: (isSplit: boolean) => void;
  onAddEnd: () => void;
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
          <button className="w-7 h-7 rounded-full border-2 border-dashed border-[#94A3B8] hover:border-[#1a4fd6] hover:bg-[#EEF2FF] flex items-center justify-center transition-all group cursor-pointer">
            <Plus className="h-3.5 w-3.5 text-[#94A3B8] group-hover:text-[#1a4fd6]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-68 max-h-[340px] overflow-y-auto">
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
              className="text-xs cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[#1a4fd6] mr-2 shrink-0" />
              {p.name}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              onAddGateway(true);
              setOpen(false);
            }}
            className="text-xs cursor-pointer"
          >
            <GitBranch className="h-3.5 w-3.5 mr-2 text-[#F59E0B]" />
            {pt ? "Gateway com 2 caminhos (Bifurcação)" : "Gateway with 2 branches"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onAddGateway(false);
              setOpen(false);
            }}
            className="text-xs text-muted-foreground cursor-pointer"
          >
            <Diamond className="h-3.5 w-3.5 mr-2 text-[#F59E0B]" />
            {pt ? "Gateway simples (linear)" : "Simple gateway (linear)"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              onAddEnd();
              setOpen(false);
            }}
            className="text-xs text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
          >
            <Square className="h-3.5 w-3.5 mr-2 fill-red-500" />
            {pt ? "Evento de fim" : "End event"}
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
  onSelectProcess,
}: ProcessFlowEditorProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const navigate = useNavigate();

  const [selectedProcessForAction, setSelectedProcessForAction] = useState<ProcessData | null>(null);
  const [connectionMapProcess, setConnectionMapProcess] = useState<{ id: string; name: string; domain?: string } | null>(null);

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

  // ── Split Gateway Dialog State ──
  const [splitDialogOpen, setSplitDialogOpen] = useState(false);
  const [splitTargetGatewayId, setSplitTargetGatewayId] = useState<string | null>(null);
  const [splitBranchALabel, setSplitBranchALabel] = useState("Sim");
  const [splitBranchBLabel, setSplitBranchBLabel] = useState("Não");
  const [splitDistributeFollowing, setSplitDistributeFollowing] = useState(true);
  const [splitExitType, setSplitExitType] = useState<"converge" | "distinct_ends">("converge");

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
    const ids = new Set<string>();
    const collect = (list: FlowNode[]) => {
      for (const n of list) {
        if (n.type === "activity" && n.processId) {
          ids.add(n.processId);
        }
        if (n.type === "gateway" && n.branches) {
          for (const b of n.branches) {
            collect(b.nodes || []);
          }
        }
      }
    };
    collect(nodes);
    return ids;
  }, [isEditing, editNodes, selectedFlow]);

  const processMap = useMemo(() => {
    const map = new Map<string, string>();
    availableProcesses.forEach((p) => map.set(p.id, p.name));
    return map;
  }, [availableProcesses]);

  const handleSelectNode = useCallback(
    (node: FlowNode) => {
      if (node.type !== "activity") return;
      const resolvedName = (node.processId ? processMap.get(node.processId) : null) || node.label;
      const matched = availableProcesses.find(
        (p) =>
          p.id === node.processId ||
          p.id === node.id ||
          p.name.trim().toLowerCase() === resolvedName.trim().toLowerCase()
      );

      const procData: ProcessData = {
        id: node.processId || matched?.id || node.id,
        name: resolvedName,
        description: matched?.description || "",
        l1: parentNodeName,
        status: "ativo",
        ...matched,
      } as ProcessData;

      if (onSelectProcess) {
        onSelectProcess(procData);
      } else {
        setSelectedProcessForAction(procData);
      }
    },
    [availableProcesses, processMap, parentNodeName, onSelectProcess]
  );

  // ── Text Normalizer & RACI Row Matcher ──
  const normalizeRaciText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  const findRaciRowForProcess = (
    rows: RaciRow[],
    processId?: string,
    processName?: string
  ): RaciRow | undefined => {
    if (!rows || rows.length === 0) return undefined;

    // 1. Direct ID match
    if (processId) {
      const directMatch = rows.find(
        (r) => r.id === processId || r.id.toLowerCase() === processId.toLowerCase()
      );
      if (directMatch) return directMatch;
    }

    // 2. Numeric suffix match (e.g. "l4-1" -> "1", "row-1" -> "1")
    if (processId) {
      const idDigits = processId.replace(/\D/g, "");
      if (idDigits) {
        const numMatch = rows.find((r) => {
          const rowDigits = r.id.replace(/\D/g, "");
          return rowDigits === idDigits;
        });
        if (numMatch) return numMatch;
      }
    }

    // 3. Match by procedure name
    if (processName) {
      const normTarget = normalizeRaciText(processName);
      if (normTarget) {
        // 3a. Exact normalized match
        const exactMatch = rows.find((r) => normalizeRaciText(r.procedure) === normTarget);
        if (exactMatch) return exactMatch;

        // 3b. One contains the other
        const incMatch = rows.find((r) => {
          const normProc = normalizeRaciText(r.procedure);
          return normTarget.includes(normProc) || normProc.includes(normTarget);
        });
        if (incMatch) return incMatch;

        // 3c. Overlap of key words
        const stopWords = new Set(["de", "do", "da", "dos", "das", "e", "para", "o", "a", "os", "as", "em", "um", "uma", "com"]);
        const targetWords = normTarget.split(" ").filter((w) => w.length > 2 && !stopWords.has(w));

        let bestMatch: RaciRow | undefined = undefined;
        let maxOverlap = 0;

        for (const r of rows) {
          const procWords = new Set(
            normalizeRaciText(r.procedure)
              .split(" ")
              .filter((w) => w.length > 2 && !stopWords.has(w))
          );
          const overlap = targetWords.filter((w) => procWords.has(w)).length;
          if (overlap >= 2 && overlap > maxOverlap) {
            maxOverlap = overlap;
            bestMatch = r;
          }
        }
        if (bestMatch) return bestMatch;
      }
    }

    return undefined;
  };

  // ── RACI Data Integration ──
  const [isRaciModalOpen, setIsRaciModalOpen] = useState(false);

  useEffect(() => {
    if (parentNodeId) {
      useRaciStore.getState().getMatrix(parentNodeId, parentNodeName, availableProcesses);
    }
  }, [parentNodeId, parentNodeName, availableProcesses]);

  const raciMatrix = useRaciStore(
    (s) => s.matrices[parentNodeId] || s.matrices["l4-conceituacao"] || s.matrices["l3-conceituacao"]
  );

  const getProcessRaciData = useCallback(
    (processId?: string, processName?: string): ProcessRaciSummary | undefined => {
      const activeMatrix =
        raciMatrix ||
        useRaciStore.getState().matrices[parentNodeId] ||
        useRaciStore.getState().matrices["l4-conceituacao"] ||
        useRaciStore.getState().matrices["l3-conceituacao"] ||
        useRaciStore.getState().getMatrix(parentNodeId, parentNodeName, availableProcesses);

      if (!activeMatrix || !activeMatrix.rows || activeMatrix.rows.length === 0) return undefined;

      const row = findRaciRowForProcess(activeMatrix.rows, processId, processName);
      if (!row || !row.cells) return undefined;

      const rList: ProcessRaciRoleItem[] = [];
      const aList: ProcessRaciRoleItem[] = [];
      const cList: ProcessRaciRoleItem[] = [];
      const iList: ProcessRaciRoleItem[] = [];

      Object.entries(row.cells).forEach(([area, cell]) => {
        const c = cell as { roles?: string[]; note?: string } | undefined;
        const roles = c?.roles || [];
        if (roles.includes("R")) rList.push({ area, note: c?.note });
        if (roles.includes("A")) aList.push({ area, note: c?.note });
        if (roles.includes("C")) cList.push({ area, note: c?.note });
        if (roles.includes("I")) iList.push({ area, note: c?.note });
      });

      const totalCount = rList.length + aList.length + cList.length + iList.length;
      if (totalCount === 0) return undefined;

      return {
        rowId: row.id,
        procedureName: row.procedure,
        subDetail: row.subDetail,
        r: rList,
        a: aList,
        c: cList,
        i: iList,
        totalCount,
      };
    },
    [raciMatrix, parentNodeId, parentNodeName, availableProcesses]
  );

  // Activities that come immediately after the gateway selected for splitting
  const splitTargetGatewayFollowing = useMemo(() => {
    if (!splitTargetGatewayId) return [];
    const gwIdx = editNodes.findIndex((n) => n.id === splitTargetGatewayId);
    if (gwIdx === -1) return [];
    return editNodes.slice(gwIdx + 1).filter((n) => n.type === "activity");
  }, [splitTargetGatewayId, editNodes]);

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

  const toggleEditMode = (checked: boolean) => {
    if (checked) {
      startEditing();
    } else {
      saveEditing();
    }
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
  const insertNodeAt = (
    afterIndex: number,
    type: FlowNodeType,
    processId?: string,
    isSplit?: boolean
  ) => {
    const genId = () => Math.random().toString(36).slice(2, 11);
    const label =
      type === "gateway"
        ? "Decisão XOR"
        : processId
          ? processMap.get(processId) || "Processo"
          : "Processo";

    const newNode: FlowNode = {
      id: genId(),
      type,
      processId,
      label,
      order: afterIndex + 0.5,
      isSplit: type === "gateway" ? (isSplit !== undefined ? isSplit : true) : undefined,
      branches:
        type === "gateway" && isSplit
          ? [
              { id: genId(), label: pt ? "Sim" : "Yes", nodes: [] },
              { id: genId(), label: pt ? "Não" : "No", nodes: [] },
            ]
          : undefined,
    };

    const updated = [...editNodes, newNode].sort((a, b) => a.order - b.order);
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

  // ── Gateway Branching Handlers ──

  const handleRequestSplit = (gatewayId: string) => {
    setSplitTargetGatewayId(gatewayId);
    setSplitBranchALabel(pt ? "Sim" : "Yes");
    setSplitBranchBLabel(pt ? "Não" : "No");
    setSplitDistributeFollowing(true);
    setSplitExitType("converge");
    setSplitDialogOpen(true);
  };

  const handleConfirmSplit = () => {
    if (!splitTargetGatewayId) return;
    const genId = () => Math.random().toString(36).slice(2, 11);

    const gwIdx = editNodes.findIndex((n) => n.id === splitTargetGatewayId);
    if (gwIdx === -1) return;

    const followingActivities = editNodes
      .slice(gwIdx + 1)
      .filter((n) => n.type === "activity");

    let branchANodes: FlowNode[] = [];
    let branchBNodes: FlowNode[] = [];
    const removedNodeIds = new Set<string>();

    if (splitDistributeFollowing && followingActivities.length > 0) {
      if (followingActivities[0]) {
        branchANodes.push({ ...followingActivities[0], order: 0 });
        removedNodeIds.add(followingActivities[0].id);
      }
      if (followingActivities[1]) {
        branchBNodes.push({ ...followingActivities[1], order: 0 });
        removedNodeIds.add(followingActivities[1].id);
      }
    }

    // If user chose distinct ends, add End event to each branch
    if (splitExitType === "distinct_ends") {
      branchANodes.push({
        id: genId(),
        type: "end",
        label: pt ? `Fim (${splitBranchALabel || "Sim"})` : `End (${splitBranchALabel || "Yes"})`,
        order: branchANodes.length,
      });
      branchBNodes.push({
        id: genId(),
        type: "end",
        label: pt ? `Fim (${splitBranchBLabel || "Não"})` : `End (${splitBranchBLabel || "No"})`,
        order: branchBNodes.length,
      });
    }

    const updated = editNodes
      .filter((n) => !removedNodeIds.has(n.id))
      .map((n) => {
        if (n.id !== splitTargetGatewayId) return n;
        return {
          ...n,
          isSplit: true,
          branches: [
            {
              id: genId(),
              label: splitBranchALabel.trim() || (pt ? "Sim" : "Yes"),
              nodes: branchANodes,
            },
            {
              id: genId(),
              label: splitBranchBLabel.trim() || (pt ? "Não" : "No"),
              nodes: branchBNodes,
            },
          ],
        };
      });

    updated.forEach((n, i) => (n.order = i));
    setEditNodes(updated);
    setEditConnections(rebuildConnections(updated));
    setSplitDialogOpen(false);
    toast.success(pt ? "Fluxo dividido em 2 caminhos com sucesso!" : "Flow split into 2 branches successfully!");
  };

  const handleUnsplitGateway = (gatewayId: string) => {
    const gw = editNodes.find((n) => n.id === gatewayId);
    if (!gw) return;

    const extractedNodes: FlowNode[] = [];
    if (gw.branches) {
      gw.branches.forEach((b) => {
        // filter out branch ends when returning to linear flow
        extractedNodes.push(...b.nodes.filter((n) => n.type !== "end"));
      });
    }

    const gwIdx = editNodes.findIndex((n) => n.id === gatewayId);
    const before = editNodes.slice(0, gwIdx);
    const after = editNodes.slice(gwIdx + 1);

    const unsplitGw: FlowNode = {
      ...gw,
      isSplit: false,
      branches: undefined,
    };

    const updated = [...before, unsplitGw, ...extractedNodes, ...after];
    updated.forEach((n, i) => (n.order = i));
    setEditNodes(updated);
    setEditConnections(rebuildConnections(updated));
    toast.info(pt ? "Caminhos unificados na linha principal." : "Branches unified into main flow.");
  };

  const handleAddBranchNode = (gatewayId: string, branchId: string, processId: string) => {
    const genId = () => Math.random().toString(36).slice(2, 11);
    const label = processMap.get(processId) || "Processo";

    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) => {
        if (b.id !== branchId) return b;
        const newBranchNode: FlowNode = {
          id: genId(),
          type: "activity",
          processId,
          label,
          order: b.nodes.length,
        };
        return { ...b, nodes: [...b.nodes, newBranchNode] };
      });
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
  };

  const handleAddBranchEnd = (gatewayId: string, branchId: string) => {
    const genId = () => Math.random().toString(36).slice(2, 11);

    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) => {
        if (b.id !== branchId) return b;
        if (b.nodes.some((node) => node.type === "end")) return b;
        const newEndNode: FlowNode = {
          id: genId(),
          type: "end",
          label: pt ? `Fim (${b.label || "Ramo"})` : `End (${b.label || "Branch"})`,
          order: b.nodes.length,
        };
        return { ...b, nodes: [...b.nodes, newEndNode] };
      });
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
    toast.success(pt ? "Evento de fim adicionado a este caminho." : "End event added to this branch.");
  };

  const handleToggleBranchEnds = (gatewayId: string) => {
    const genId = () => Math.random().toString(36).slice(2, 11);

    const gw = editNodes.find((n) => n.id === gatewayId);
    if (!gw || !gw.branches) return;

    const bothEnd = gw.branches.every((b) => b.nodes.some((n) => n.type === "end"));

    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) => {
        if (bothEnd) {
          // Remove end events to make both converge
          return {
            ...b,
            nodes: b.nodes.filter((node) => node.type !== "end"),
          };
        } else {
          // Add end event if branch doesn't have one yet
          if (b.nodes.some((node) => node.type === "end")) return b;
          const endNode: FlowNode = {
            id: genId(),
            type: "end",
            label: pt ? `Fim (${b.label || "Ramo"})` : `End (${b.label || "Branch"})`,
            order: b.nodes.length,
          };
          return { ...b, nodes: [...b.nodes, endNode] };
        }
      });
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
    toast.info(
      bothEnd
        ? pt ? "Caminhos reconfigurados para convergir." : "Branches reconfigured to converge."
        : pt ? "Eventos de fim independentes configurados para os 2 caminhos." : "Distinct end events configured for both branches."
    );
  };

  const handleRemoveBranchNode = (gatewayId: string, branchId: string, childId: string) => {
    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) => {
        if (b.id !== branchId) return b;
        const filtered = b.nodes.filter((node) => node.id !== childId);
        filtered.forEach((node, i) => (node.order = i));
        return { ...b, nodes: filtered };
      });
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
  };

  const handleRenameBranch = (gatewayId: string, branchId: string, newLabel: string) => {
    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) =>
        b.id === branchId ? { ...b, label: newLabel } : b
      );
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
  };

  const handleRenameGateway = (gatewayId: string, newLabel: string) => {
    const updated = editNodes.map((n) =>
      n.id === gatewayId ? { ...n, label: newLabel } : n
    );
    setEditNodes(updated);
  };

  const handleRenameBranchNode = (
    gatewayId: string,
    branchId: string,
    childId: string,
    newLabel: string
  ) => {
    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const updatedBranches = n.branches.map((b) => {
        if (b.id !== branchId) return b;
        const updatedNodes = b.nodes.map((node) =>
          node.id === childId ? { ...node, label: newLabel } : node
        );
        return { ...b, nodes: updatedNodes };
      });
      return { ...n, branches: updatedBranches };
    });

    setEditNodes(updated);
  };

  const handleAddBranch = (gatewayId: string) => {
    const genId = () => Math.random().toString(36).slice(2, 11);
    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      const branchCount = n.branches.length + 1;
      const newBranch: FlowBranch = {
        id: genId(),
        label: `Caminho ${branchCount}`,
        nodes: [],
      };
      return { ...n, branches: [...n.branches, newBranch] };
    });
    setEditNodes(updated);
    toast.success(pt ? "Novo caminho paralelo adicionado!" : "New parallel branch added!");
  };

  const handleRemoveBranch = (gatewayId: string, branchId: string) => {
    const updated = editNodes.map((n) => {
      if (n.id !== gatewayId || !n.branches) return n;
      if (n.branches.length <= 2) {
        toast.error(pt ? "O gateway precisa ter pelo menos 2 caminhos." : "Gateway must have at least 2 branches.");
        return n;
      }
      return {
        ...n,
        branches: n.branches.filter((b) => b.id !== branchId),
      };
    });
    setEditNodes(updated);
  };

  if (!visible) return null;

  // ── Render ─────────────────────────

  return (
    <div className="w-full">
      {/* ── Flow visualization ── */}
      {selectedFlow || isEditing ? (
        <div className="bg-gradient-to-br from-[#F8FAFD] to-[#F1F5FB] border border-[#DFE5EF] rounded-xl p-6 shadow-inner overflow-x-auto min-h-[380px] flex flex-col justify-center">
          {/* Integrated Compact Header */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[#DFE5EF]/60">
            <div className="flex items-center gap-3">
              {flows.length > 0 && (
                <Select
                  value={selectedFlowId || ""}
                  onValueChange={(v) => {
                    if (isEditing) saveEditing();
                    setSelectedFlowId(v);
                  }}
                >
                  <SelectTrigger className="h-8 min-w-[170px] max-w-[240px] text-xs font-semibold bg-white border-[#DFE5EF] shadow-2xs">
                    <SelectValue placeholder={pt ? "Selecionar fluxo..." : "Select flow..."} />
                  </SelectTrigger>
                  <SelectContent>
                    {flows.map((f) => (
                      <SelectItem key={f.id} value={f.id} className="text-xs">
                        <div className="flex items-center gap-2">
                          {f.isDefault && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                          <span className="font-medium text-[#263754]">{f.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {selectedFlow?.description && (
                <span className="text-[11px] text-[#7C889E] hidden md:inline max-w-md truncate" title={selectedFlow.description}>
                  {selectedFlow.description}
                </span>
              )}
            </div>

            {/* Compact Options Button */}
            <div className="flex items-center gap-2">
              {isEditing && (
                <span className="text-[10px] font-bold text-[#1a4fd6] bg-[#EEF2FF] border border-[#1a4fd6]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4fd6] animate-pulse" />
                  {pt ? "Modo Edição" : "Edit Mode"}
                </span>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-lg border-[#DFE5EF] bg-white text-[#4D5A72] hover:text-[#1A2A48] hover:bg-slate-50 shadow-2xs cursor-pointer"
                    title={pt ? "Opções do fluxo" : "Flow options"}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* Toggle Modo Edição */}
                  <DropdownMenuItem
                    onClick={() => toggleEditMode(!isEditing)}
                    className="text-xs flex items-center justify-between cursor-pointer"
                  >
                    <span className="font-semibold text-[#1A2A48]">{pt ? "Modo Edição" : "Edit Mode"}</span>
                    <Switch checked={isEditing} onCheckedChange={toggleEditMode} />
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Definir como padrão */}
                  {selectedFlow && (
                    <DropdownMenuItem
                      onClick={handleToggleDefault}
                      className="text-xs cursor-pointer"
                    >
                      {selectedFlow.isDefault ? (
                        <>
                          <Star className="h-3.5 w-3.5 mr-2 fill-amber-500 text-amber-500" />
                          <span>{pt ? "Remover padrão" : "Remove default"}</span>
                        </>
                      ) : (
                        <>
                          <StarOff className="h-3.5 w-3.5 mr-2 text-[#7C889E]" />
                          <span>{pt ? "Definir como padrão" : "Set as default"}</span>
                        </>
                      )}
                    </DropdownMenuItem>
                  )}

                  {/* Informações */}
                  {selectedFlow && (
                    <DropdownMenuItem
                      onClick={() => {
                        setNewFlowName(selectedFlow.name);
                        setNewFlowDesc(selectedFlow.description || "");
                        setEditInfoDialogOpen(true);
                      }}
                      className="text-xs cursor-pointer"
                    >
                      <Pencil className="h-3.5 w-3.5 mr-2 text-[#7C889E]" />
                      <span>{pt ? "Informações do fluxo" : "Flow info"}</span>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  {/* Novo fluxo */}
                  <DropdownMenuItem
                    onClick={() => {
                      setNewFlowName("");
                      setNewFlowDesc("");
                      setCreateDialogOpen(true);
                    }}
                    className="text-xs cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 mr-2 text-[#1a4fd6]" />
                    <span>{pt ? "Novo fluxo" : "New flow"}</span>
                  </DropdownMenuItem>

                  {/* Matriz RACI */}
                  <DropdownMenuItem
                    onClick={() => setIsRaciModalOpen(true)}
                    className="text-xs cursor-pointer"
                  >
                    <TableProperties className="h-3.5 w-3.5 mr-2 text-[#6633D0]" />
                    <span>{pt ? "Matriz RACI completa" : "Full RACI Matrix"}</span>
                  </DropdownMenuItem>

                  {/* Excluir fluxo */}
                  {selectedFlow && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setDeleteDialogOpen(true)}
                        className="text-xs text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-2 text-red-500" />
                        <span>{pt ? "Excluir este fluxo" : "Delete flow"}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Horizontal flow */}
          <div className="flex items-center gap-0 min-w-max pb-2">
            {displayNodes.map((node, idx) => {
              const isStart = node.type === "start";
              const isSplitGateway = node.type === "gateway" && node.isSplit;

              // Check if previous node is a split gateway that terminates both branches in End events
              const prevNode = idx > 0 ? displayNodes[idx - 1] : null;
              const prevIsBothEndGateway =
                prevNode?.type === "gateway" &&
                prevNode?.isSplit &&
                prevNode?.branches?.every((b) => b.nodes.some((n) => n.type === "end"));

              // If both branches in the previous gateway terminated with their own ends, and current node is main "end", hide redundant orphan in view mode
              if (!isEditing && node.type === "end" && prevIsBothEndGateway) {
                return null;
              }

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
                        onAddGateway={(isSplit) => insertNodeAt(idx - 1, "gateway", undefined, isSplit)}
                        onAddEnd={() => insertNodeAt(idx - 1, "end")}
                        availableProcesses={availableProcesses}
                        usedProcessIds={usedProcessIds}
                      />
                    </>
                  )}

                  {/* Arrow before non-start nodes in view mode */}
                  {!isEditing && idx > 0 && !prevIsBothEndGateway && <FlowArrow />}

                  {isSplitGateway ? (
                    <GatewayBranchView
                      node={node}
                      isEditing={isEditing}
                      availableProcesses={availableProcesses}
                      usedProcessIds={usedProcessIds}
                      processMap={processMap}
                      getProcessRaciData={getProcessRaciData}
                      onRemoveGateway={() => removeEditNode(node.id)}
                      onUnsplitGateway={() => handleUnsplitGateway(node.id)}
                      onAddBranchNode={handleAddBranchNode}
                      onAddBranchEnd={handleAddBranchEnd}
                      onRemoveBranchNode={handleRemoveBranchNode}
                      onRenameBranch={handleRenameBranch}
                      onRenameGateway={handleRenameGateway}
                      onRenameBranchNode={handleRenameBranchNode}
                      onToggleBranchEnds={handleToggleBranchEnds}
                      onAddBranch={handleAddBranch}
                      onRemoveBranch={handleRemoveBranch}
                      onSelectNode={handleSelectNode}
                    />
                  ) : (
                    <FlowNodeCard
                      node={node}
                      processName={
                        node.processId ? processMap.get(node.processId) : undefined
                      }
                      raciData={getProcessRaciData(node.processId, node.processId ? processMap.get(node.processId) : node.label)}
                      isEditing={isEditing}
                      onRemove={
                        !isStart
                          ? () => removeEditNode(node.id)
                          : undefined
                      }
                      onSplitGateway={
                        node.type === "gateway" ? () => handleRequestSplit(node.id) : undefined
                      }
                      onSelect={() => handleSelectNode(node)}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {isEditing && (
            <div className="mt-4 pt-3 border-t border-[#DFE5EF]/60">
              <p className="text-[10px] text-[#94A3B8] italic">
                {pt
                  ? "Dica: Você pode convergir os caminhos ou finalizar cada caminho com um Evento de Fim independente (clicando em '+' no caminho ou no atalho '2 Fins distintos')."
                  : "Tip: You can merge branches or finish each branch with an independent End Event (click '+' in branch or shortcut '2 Distinct ends')."}
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
            className="text-[11px] cursor-pointer"
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

      {/* ── Dialog: Dividir Gateway em 2 Caminhos ── */}
      <Dialog open={splitDialogOpen} onOpenChange={setSplitDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-amber-500" />
              {pt ? "Dividir Fluxo em 2 Caminhos" : "Split Flow into 2 Branches"}
            </DialogTitle>
            <DialogDescription>
              {pt
                ? "Configure a bifurcação desta decisão. Escolha se os caminhos convergirão adiante ou terão eventos de fim próprios."
                : "Configure the branches for this decision. Choose if paths will merge forward or end with independent end events."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                  {pt ? "Rótulo Caminho 1 *" : "Branch 1 Label *"}
                </label>
                <Input
                  value={splitBranchALabel}
                  onChange={(e) => setSplitBranchALabel(e.target.value)}
                  placeholder={pt ? "Ex.: Sim" : "E.g. Yes"}
                  className="text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#4D5A72] mb-1 block">
                  {pt ? "Rótulo Caminho 2 *" : "Branch 2 Label *"}
                </label>
                <Input
                  value={splitBranchBLabel}
                  onChange={(e) => setSplitBranchBLabel(e.target.value)}
                  placeholder={pt ? "Ex.: Não" : "E.g. No"}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Exit Mode Selection: Convergir vs 2 Fins distintos */}
            <div className="bg-[#F8FAFD] border border-[#DFE5EF] rounded-xl p-3 flex flex-col gap-2">
              <label className="text-xs font-semibold text-[#1A2A48] block">
                {pt ? "Comportamento de Saída dos Caminhos" : "Branch Exit Behavior"}
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setSplitExitType("converge")}
                  className={cn(
                    "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                    splitExitType === "converge"
                      ? "border-[#1a4fd6] bg-blue-50/60 shadow-xs"
                      : "border-[#DFE5EF] bg-white hover:border-slate-300"
                  )}
                >
                  <span className="text-xs font-bold text-[#1A2A48] flex items-center gap-1.5">
                    <span>⤡</span> {pt ? "Convergente" : "Convergent"}
                  </span>
                  <span className="text-[10px] text-[#7C889E] mt-0.5 leading-snug">
                    {pt ? "Os caminhos se reúnem adiante" : "Paths merge forward"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setSplitExitType("distinct_ends")}
                  className={cn(
                    "flex flex-col items-start p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                    splitExitType === "distinct_ends"
                      ? "border-red-500 bg-red-50/60 shadow-xs"
                      : "border-[#DFE5EF] bg-white hover:border-slate-300"
                  )}
                >
                  <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                    <Square className="h-3 w-3 fill-red-500" /> {pt ? "2 Fins Distintos" : "2 Distinct Ends"}
                  </span>
                  <span className="text-[10px] text-[#7C889E] mt-0.5 leading-snug">
                    {pt ? "Cada caminho tem seu próprio fim" : "Each path has its own end"}
                  </span>
                </button>
              </div>
            </div>

            {splitTargetGatewayFollowing.length > 0 && (
              <div className="bg-[#F8FAFD] border border-[#DFE5EF] rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="distribute-following"
                    checked={splitDistributeFollowing}
                    onChange={(e) => setSplitDistributeFollowing(e.target.checked)}
                    className="mt-0.5 rounded border-[#CBD5E1] text-[#1a4fd6] focus:ring-[#1a4fd6] cursor-pointer"
                  />
                  <label htmlFor="distribute-following" className="text-xs font-semibold text-[#1A2A48] cursor-pointer">
                    {pt
                      ? "Distribuir processos seguintes nos caminhos criados"
                      : "Distribute following processes into the created branches"}
                  </label>
                </div>
                <p className="text-[11px] text-[#7C889E] pl-5 leading-relaxed">
                  {pt ? (
                    <>
                      • <b>{splitBranchALabel || "Caminho 1"}</b>: {splitTargetGatewayFollowing[0]?.label}
                      <br />
                      • <b>{splitBranchBLabel || "Caminho 2"}</b>: {splitTargetGatewayFollowing[1]?.label || "(sem processo inicial)"}
                    </>
                  ) : (
                    <>
                      • <b>{splitBranchALabel || "Branch 1"}</b>: {splitTargetGatewayFollowing[0]?.label}
                      <br />
                      • <b>{splitBranchBLabel || "Branch 2"}</b>: {splitTargetGatewayFollowing[1]?.label || "(empty)"}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setSplitDialogOpen(false)} className="cursor-pointer">
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleConfirmSplit}
              className="bg-[#1a4fd6] hover:bg-[#1539b0] text-white cursor-pointer"
            >
              <Check className="h-4 w-4 mr-1.5" />
              {pt ? "Confirmar Divisão" : "Confirm Split"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            <Button variant="ghost" onClick={() => setCreateDialogOpen(false)} className="cursor-pointer">
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newFlowName.trim()}
              className="bg-[#1a4fd6] hover:bg-[#1539b0] cursor-pointer"
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
            <Button variant="ghost" onClick={() => setEditInfoDialogOpen(false)} className="cursor-pointer">
              {pt ? "Cancelar" : "Cancel"}
            </Button>
            <Button onClick={handleUpdateInfo} className="bg-[#1a4fd6] hover:bg-[#1539b0] cursor-pointer">
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
            <DialogTitle>
              {pt ? "Excluir fluxo?" : "Delete flow?"}
            </DialogTitle>
            <AlertDialogDescription>
              {pt
                ? `O fluxo "${selectedFlow?.name}" será excluído permanentemente. Essa ação não pode ser desfeita.`
                : `The flow "${selectedFlow?.name}" will be permanently deleted. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">{pt ? "Cancelar" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              {pt ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Modal da Matriz RACI completa ── */}
      <RaciMatrixModal
        open={isRaciModalOpen}
        onOpenChange={setIsRaciModalOpen}
        nodeId={parentNodeId}
        nodeTitle={parentNodeName}
        stageName={parentNodeName}
        fallbackProcedures={availableProcesses}
      />

      {/* ── Modal de Ações do Processo (Detalhamento / Predecessores e Sucessores) ── */}
      <ProcessActionDialog
        open={!!selectedProcessForAction}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedProcessForAction(null);
        }}
        process={selectedProcessForAction}
        onViewDetail={(procId) => {
          setSelectedProcessForAction(null);
          navigate(`/processes/${procId}`);
        }}
        onViewConnectionMap={(proc) => {
          setSelectedProcessForAction(null);
          setConnectionMapProcess({
            id: proc.id,
            name: proc.name,
            domain: proc.l1 || parentNodeName || "Gestão da Inovação de Produtos",
          });
        }}
      />

      {/* ── Modal de Mapa de Predecessores e Sucessores ── */}
      {connectionMapProcess && (
        <ProcessConnectionMapModal
          open={!!connectionMapProcess}
          onOpenChange={(isOpen) => {
            if (!isOpen) setConnectionMapProcess(null);
          }}
          initialProcessId={connectionMapProcess.id}
          initialProcessName={connectionMapProcess.name}
          initialDomain={connectionMapProcess.domain}
          onNavigateToProcess={(procId) => {
            setConnectionMapProcess(null);
            navigate(`/processes/${procId}`);
          }}
        />
      )}
    </div>
  );
}

