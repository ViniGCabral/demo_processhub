import { useState } from "react";
import { Plus, MoreHorizontal, ChevronDown, ChevronRight, Lightbulb, Layers, FileText, FileCheck, FileX, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { L1Process, L2Process, L3Process, L4Task, useValueChainStore } from "@/stores/valueChainStore";
import { useProcessStore } from "@/stores/processStore";
import { useNavigate } from "react-router-dom";
import { CreateEditL2Modal } from "../modals/CreateEditL2Modal";
import { CreateEditL3Modal } from "../modals/CreateEditL3Modal";
import { CreateEditL4Modal } from "../modals/CreateEditL4Modal";
import { SavedUseCasesPanel } from "../SavedUseCasesPanel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { toast } from "sonner";

interface L2MasterDetailProps {
  l1: L1Process;
  onBack: () => void;
}

export function L2MasterDetail({ l1, onBack }: L2MasterDetailProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { l1Processes, deleteL2, addL2, deleteL3, deleteL4 } = useValueChainStore();
  const { processes } = useProcessStore();

  const currentL1 = l1Processes.find((p) => p.id === l1.id) || l1;

  const [expandedL2s, setExpandedL2s] = useState<Set<string>>(new Set());
  const [expandedL3s, setExpandedL3s] = useState<Set<string>>(new Set());

  // Modal states
  const [isL2ModalOpen, setIsL2ModalOpen] = useState(false);
  const [editingL2, setEditingL2] = useState<L2Process | null>(null);
  const [isL3ModalOpen, setIsL3ModalOpen] = useState(false);
  const [editingL3, setEditingL3] = useState<{ l2Id: string; l3: L3Process | null } | null>(null);
  const [isL4ModalOpen, setIsL4ModalOpen] = useState(false);
  const [editingL4, setEditingL4] = useState<{ l2Id: string; l3Id: string; l4: L4Task | null } | null>(null);
  const [showSavedUseCases, setShowSavedUseCases] = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "l2" | "l3" | "l4";
    l2Id: string;
    l3Id?: string;
    l4Id?: string;
    hasChildren: boolean;
  } | null>(null);

  // Stats
  const totalL2s = currentL1.l2Processes.length;
  const totalL3s = currentL1.l2Processes.reduce((sum, l2) => sum + l2.l3Processes.length, 0);
  const totalL4s = currentL1.l2Processes.reduce(
    (sum, l2) => sum + l2.l3Processes.reduce((s, l3) => s + l3.l4Tasks.length, 0), 0
  );
  const totalProcesses = currentL1.l2Processes.reduce(
    (sum, l2) => sum + l2.l3Processes.reduce(
      (s, l3) => s + l3.l4Tasks.reduce(
        (ps, l4) => ps + processes.filter((p) => p.l4 === l4.name).length, 0
      ), 0
    ), 0
  );

  const toggleL2 = (id: string) => {
    setExpandedL2s((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const toggleL3 = (id: string) => {
    setExpandedL3s((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const getProcessCountForL4 = (l4Name: string) =>
    processes.filter((p) => p.l4 === l4Name).length;

  const getProcessStatsForL4 = (l4Name: string) => {
    const matched = processes.filter((p) => p.l4 === l4Name);
    const total = matched.length;
    const withDoc = matched.filter((p) => p.hasDocumentation).length;
    const withoutDoc = total - withDoc;
    return { total, withDoc, withoutDoc };
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;
    const { type, l2Id, l3Id, l4Id } = deleteConfirm;
    if (type === "l2") {
      deleteL2(currentL1.id, l2Id);
      toast.success(language === "PT" ? "L2 excluído" : "L2 deleted");
    } else if (type === "l3" && l3Id) {
      deleteL3(currentL1.id, l2Id, l3Id);
      toast.success(language === "PT" ? "L3 excluído" : "L3 deleted");
    } else if (type === "l4" && l3Id && l4Id) {
      deleteL4(currentL1.id, l2Id, l3Id, l4Id);
      toast.success(language === "PT" ? "L4 excluído" : "L4 deleted");
    }
    setDeleteConfirm(null);
  };

  const handleExploreUseCases = (level: string, sourceId: string, sourceName: string) => {
    navigate(`/use-cases?level=${level}&sourceId=${sourceId}&sourceName=${encodeURIComponent(sourceName)}&l1Id=${currentL1.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats — flat minimal boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "L2", value: totalL2s, icon: Layers },
          { label: "L3", value: totalL3s, icon: Layers },
          { label: "L4", value: totalL4s, icon: FileText },
          { label: language === "PT" ? "Processos" : "Processes", value: totalProcesses, icon: FileText },
        ].map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 px-4 py-3 rounded-sm border border-[#A5A7B0]/30 bg-white"
          >
            <div className="h-9 w-9 rounded-sm bg-[#c9dcf2] flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-[#0C1BA8]" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-[#272727] leading-none">{stat.value}</p>
              <p className="text-xs text-[#A5A7B0] mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#272727]">
          {language === "PT" ? "Estrutura da Cadeia" : "Chain Structure"}
        </h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-sm border-[#0C1BA8] text-[#0C1BA8] hover:bg-[#0C1BA8]/5 hover:text-[#04223D]"
            onClick={() => navigate(`/saved-use-cases?l1Id=${currentL1.id}`)}
          >
            <Bookmark size={14} />
            {language === "PT" ? "Casos de Uso Salvos" : "Saved Use Cases"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5 rounded-sm border-[#0C1BA8] text-[#0C1BA8] hover:bg-[#0C1BA8]/5 hover:text-[#04223D]"
            onClick={() => handleExploreUseCases("l1", currentL1.id, currentL1.nameEN)}
          >
            <Lightbulb size={14} />
            {language === "PT" ? "Explorar Casos de Uso" : "Explore Use Cases"}
          </Button>
          <Button
            size="sm"
            className="gap-1 rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
            onClick={() => { setEditingL2(null); setIsL2ModalOpen(true); }}
          >
            <Plus size={14} />
            {language === "PT" ? "Adicionar L2" : "Add L2"}
          </Button>
        </div>
      </div>

      {/* Saved Use Cases - navigates to separate page */}

      {/* Tree Grid Container */}
      {currentL1.l2Processes.length === 0 ? (
        <div className="text-center py-16 rounded-sm border border-dashed border-[#A5A7B0]/40 bg-white">
          <Layers className="h-10 w-10 mx-auto mb-3 text-[#A5A7B0]" />
          <p className="text-[#A5A7B0] mb-4">
            {language === "PT" ? "Nenhum L2 cadastrado" : "No L2 registered"}
          </p>
          <Button
            size="sm"
            className="gap-1 rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
            onClick={() => { setEditingL2(null); setIsL2ModalOpen(true); }}
          >
            <Plus size={14} />
            {language === "PT" ? "Criar primeiro L2" : "Create first L2"}
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-[#A5A7B0]/30 overflow-hidden">
          {currentL1.l2Processes.map((l2, l2Idx) => {
            const isExpanded = expandedL2s.has(l2.id);
            const l2L3Count = l2.l3Processes.length;
            const l2L4Count = l2.l3Processes.reduce((s, l3) => s + l3.l4Tasks.length, 0);

            return (
              <div key={l2.id}>
                {/* L2 Row */}
                <div
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-colors hover:bg-[#f9f9f9] ${
                    l2Idx > 0 ? "border-t border-[#A5A7B0]/20" : ""
                  } ${isExpanded ? "border-l-[3px] border-l-[#0C1BA8]" : "border-l-[3px] border-l-transparent"}`}
                  onClick={() => toggleL2(l2.id)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-[#0C1BA8] shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-[#A5A7B0] shrink-0" />
                    )}
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] uppercase tracking-wide">
                      L2
                    </span>
                    <span className="font-medium text-[#272727] truncate">{l2.name}</span>
                    {l2.description && (
                      <span className="text-xs text-[#A5A7B0] truncate hidden md:inline ml-1">
                        {l2.description}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="text-xs text-[#A5A7B0]">{l2L3Count} L3</span>
                    <span className="text-xs text-[#A5A7B0]">{l2L4Count} L4</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <button className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-[#A5A7B0]/10 transition-colors">
                          <MoreHorizontal size={16} className="text-[#A5A7B0]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-sm">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingL2(l2); setIsL2ModalOpen(true); }}>
                          {language === "PT" ? "Editar" : "Edit"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExploreUseCases("l2", l2.id, l2.name); }}>
                          <Lightbulb size={14} className="mr-1.5" />
                          {language === "PT" ? "Casos de Uso" : "Use Cases"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          addL2(currentL1.id, { name: `${l2.name} (${language === "PT" ? "Cópia" : "Copy"})`, description: l2.description, responsible: l2.responsible });
                          toast.success(language === "PT" ? "L2 duplicado" : "L2 duplicated");
                        }}>
                          {language === "PT" ? "Duplicar" : "Duplicate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirm({ type: "l2", l2Id: l2.id, hasChildren: l2.l3Processes.length > 0 });
                        }} className="text-destructive">
                          {language === "PT" ? "Excluir" : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* L3 rows (expanded) */}
                {isExpanded && (
                  <div className="bg-[#f9f9f9] border-t border-[#A5A7B0]/15">
                    {/* L3 section header */}
                    <div className="flex items-center justify-between px-4 pl-12 py-2 border-b border-[#A5A7B0]/10">
                      <span className="text-[10px] font-semibold text-[#A5A7B0] uppercase tracking-wider">L3</span>
                      <button
                        className="flex items-center gap-1 text-xs font-medium text-[#0C1BA8] hover:text-[#04223D] transition-colors"
                        onClick={() => { setEditingL3({ l2Id: l2.id, l3: null }); setIsL3ModalOpen(true); }}
                      >
                        <Plus size={12} />
                        {language === "PT" ? "Adicionar L3" : "Add L3"}
                      </button>
                    </div>

                    {l2.l3Processes.length === 0 ? (
                      <div className="text-center py-6">
                        <p className="text-sm text-[#A5A7B0]">{language === "PT" ? "Nenhum L3" : "No L3"}</p>
                      </div>
                    ) : (
                      l2.l3Processes.map((l3) => {
                        const l3Expanded = expandedL3s.has(l3.id);
                        return (
                          <div key={l3.id}>
                            {/* L3 Row */}
                            <div
                              className={`flex items-center justify-between px-4 pl-12 py-2.5 cursor-pointer transition-colors hover:bg-white border-b border-[#A5A7B0]/10 ${
                                l3Expanded ? "border-l-[3px] border-l-[#0C1BA8]/40 ml-0" : ""
                              }`}
                              onClick={() => toggleL3(l3.id)}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {l3Expanded ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-[#0C1BA8] shrink-0" />
                                ) : (
                                  <ChevronRight className="h-3.5 w-3.5 text-[#A5A7B0] shrink-0" />
                                )}
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-[#c9dcf2]/70 text-[#0C1BA8] uppercase tracking-wide">
                                  L3
                                </span>
                                <span className="text-sm font-medium text-[#272727] truncate">{l3.name}</span>
                                <span className="text-[11px] text-[#A5A7B0]">{l3.l4Tasks.length} L4</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[#A5A7B0]/10 transition-colors">
                                      <MoreHorizontal size={14} className="text-[#A5A7B0]" />
                                    </button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-sm">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingL3({ l2Id: l2.id, l3 }); setIsL3ModalOpen(true); }}>
                                      {language === "PT" ? "Editar" : "Edit"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleExploreUseCases("l3", l3.id, l3.name); }}>
                                      <Lightbulb size={14} className="mr-1.5" />
                                      {language === "PT" ? "Casos de Uso" : "Use Cases"}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirm({ type: "l3", l2Id: l2.id, l3Id: l3.id, hasChildren: l3.l4Tasks.length > 0 });
                                    }} className="text-destructive">
                                      {language === "PT" ? "Excluir" : "Delete"}
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>

                            {/* L4 rows (expanded) */}
                            {l3Expanded && (
                              <div className="bg-white">
                                {l3.l4Tasks.length === 0 ? (
                                  <div className="py-4 text-center text-xs text-[#A5A7B0]">
                                    {language === "PT" ? "Nenhum L4" : "No L4"}
                                  </div>
                                ) : (
                                  l3.l4Tasks.map((l4) => {
                                    const stats = getProcessStatsForL4(l4.name);
                                    return (
                                      <div
                                        key={l4.id}
                                        className="flex items-center justify-between px-4 pl-20 py-2.5 border-b border-[#A5A7B0]/8 cursor-pointer transition-colors hover:bg-[#f9f9f9] group"
                                        onClick={() => navigate(`/processes?l4=${encodeURIComponent(l4.name)}`)}
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-1.5 h-1.5 rounded-full bg-[#0C1BA8] shrink-0" />
                                          <span className="text-sm text-[#272727] truncate">{l4.name}</span>
                                          <span
                                            className={`text-[10px] font-semibold px-1.5 py-0 rounded-sm ${
                                              l4.status === "active"
                                                ? "bg-[#c8f4c3] text-[#272727]"
                                                : "bg-amber-100 text-amber-700"
                                            }`}
                                          >
                                            {l4.status === "active"
                                              ? (language === "PT" ? "Ativo" : "Active")
                                              : (language === "PT" ? "Inativo" : "Inactive")}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-3 shrink-0">
                                          {/* Process stats with doc breakdown */}
                                          {stats.total > 0 ? (
                                            <div className="flex items-center gap-2.5 text-[11px]">
                                              <span className="text-[#A5A7B0] font-medium">
                                                {stats.total} {language === "PT" ? "proc" : "proc"}
                                              </span>
                                              <span className="text-[#A5A7B0]/40">|</span>
                                              <span className="flex items-center gap-0.5 text-emerald-600" title={language === "PT" ? "Com documentação" : "With documentation"}>
                                                <FileCheck size={11} />
                                                {stats.withDoc}
                                              </span>
                                              <span className="flex items-center gap-0.5 text-amber-500" title={language === "PT" ? "Sem documentação" : "Without documentation"}>
                                                <FileX size={11} />
                                                {stats.withoutDoc}
                                              </span>
                                            </div>
                                          ) : (
                                            <span className="text-[11px] text-[#A5A7B0]/50">
                                              {language === "PT" ? "0 proc" : "0 proc"}
                                            </span>
                                          )}
                                          {/* Action buttons on hover */}
                                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button
                                            className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[#c9dcf2] transition-colors"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleExploreUseCases("l4", l4.id, l4.name);
                                            }}
                                          >
                                            <Lightbulb size={12} className="text-[#0C1BA8]" />
                                          </button>
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                              <button className="h-6 w-6 flex items-center justify-center rounded-sm hover:bg-[#A5A7B0]/10 transition-colors">
                                                <MoreHorizontal size={14} className="text-[#A5A7B0]" />
                                              </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-sm">
                                              <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingL4({ l2Id: l2.id, l3Id: l3.id, l4 });
                                                setIsL4ModalOpen(true);
                                              }}>
                                                {language === "PT" ? "Editar" : "Edit"}
                                              </DropdownMenuItem>
                                              <DropdownMenuItem onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleteConfirm({ type: "l4", l2Id: l2.id, l3Id: l3.id, l4Id: l4.id, hasChildren: false });
                                              }} className="text-destructive">
                                                {language === "PT" ? "Excluir" : "Delete"}
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                                {/* Add L4 inline */}
                                <div className="flex justify-center py-2 border-b border-[#A5A7B0]/8">
                                  <button
                                    className="flex items-center gap-1 text-xs font-medium text-[#0C1BA8] hover:text-[#04223D] transition-colors"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingL4({ l2Id: l2.id, l3Id: l3.id, l4: null });
                                      setIsL4ModalOpen(true);
                                    }}
                                  >
                                    <Plus size={12} />
                                    {language === "PT" ? "Adicionar L4" : "Add L4"}
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <CreateEditL2Modal
        isOpen={isL2ModalOpen}
        onClose={() => setIsL2ModalOpen(false)}
        l1Id={currentL1.id}
        editingL2={editingL2}
      />

      {editingL3 && (
        <CreateEditL3Modal
          isOpen={isL3ModalOpen}
          onClose={() => { setIsL3ModalOpen(false); setEditingL3(null); }}
          l1Id={currentL1.id}
          l2Id={editingL3.l2Id}
          editingL3={editingL3.l3}
        />
      )}

      {editingL4 && (
        <CreateEditL4Modal
          isOpen={isL4ModalOpen}
          onClose={() => { setIsL4ModalOpen(false); setEditingL4(null); }}
          l1Id={currentL1.id}
          l2Id={editingL4.l2Id}
          l3Id={editingL4.l3Id}
          editingL4={editingL4.l4}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>{language === "PT" ? "Confirmar exclusão" : "Confirm deletion"}</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.hasChildren
                ? language === "PT" ? "Este item possui filhos que também serão excluídos. Deseja continuar?" : "This item has children that will also be deleted. Continue?"
                : language === "PT" ? "Tem certeza que deseja excluir?" : "Are you sure you want to delete?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">{language === "PT" ? "Cancelar" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
