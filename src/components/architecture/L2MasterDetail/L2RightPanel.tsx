import { useState, useEffect } from "react";
import { MoreHorizontal, Edit2, Plus, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { L2Process, L3Process, L4Task, useValueChainStore } from "@/stores/valueChainStore";
import { useProcessStore } from "@/stores/processStore";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateEditL3Modal } from "../modals/CreateEditL3Modal";
import { CreateEditL4Modal } from "../modals/CreateEditL4Modal";
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

interface L2RightPanelProps {
  l1Id: string;
  l2: L2Process;
  onEditL2: () => void;
  onDeleteL2: () => void;
}

export function L2RightPanel({ l1Id, l2, onEditL2, onDeleteL2 }: L2RightPanelProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { l1Processes, deleteL3, deleteL4 } = useValueChainStore();
  const { processes } = useProcessStore();

  // Get fresh L2 data
  const currentL2 = l1Processes
    .find((l1) => l1.id === l1Id)
    ?.l2Processes.find((l) => l.id === l2.id) || l2;

  // Expanded L3s state
  const [expandedL3s, setExpandedL3s] = useState<Set<string>>(new Set());

  // Modal states
  const [isL3ModalOpen, setIsL3ModalOpen] = useState(false);
  const [editingL3, setEditingL3] = useState<L3Process | null>(null);
  const [isL4ModalOpen, setIsL4ModalOpen] = useState(false);
  const [editingL4, setEditingL4] = useState<{ l3Id: string; l4: L4Task | null } | null>(null);

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "l3" | "l4";
    l3Id: string;
    l4Id?: string;
    hasChildren: boolean;
  } | null>(null);

  // Auto-expand first L3
  useEffect(() => {
    if (currentL2.l3Processes.length > 0 && expandedL3s.size === 0) {
      setExpandedL3s(new Set([currentL2.l3Processes[0].id]));
    }
  }, [currentL2.id]);

  const toggleL3 = (l3Id: string) => {
    setExpandedL3s((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(l3Id)) {
        newSet.delete(l3Id);
      } else {
        newSet.add(l3Id);
      }
      return newSet;
    });
  };

  const handleAddL3 = () => {
    setEditingL3(null);
    setIsL3ModalOpen(true);
  };

  const handleEditL3 = (l3: L3Process) => {
    setEditingL3(l3);
    setIsL3ModalOpen(true);
  };

  const handleDeleteL3 = (l3: L3Process) => {
    setDeleteConfirm({
      type: "l3",
      l3Id: l3.id,
      hasChildren: l3.l4Tasks.length > 0,
    });
  };

  const handleAddL4 = (l3Id: string) => {
    setEditingL4({ l3Id, l4: null });
    setIsL4ModalOpen(true);
  };

  const handleEditL4 = (l3Id: string, l4: L4Task) => {
    setEditingL4({ l3Id, l4 });
    setIsL4ModalOpen(true);
  };

  const handleDeleteL4 = (l3Id: string, l4Id: string) => {
    setDeleteConfirm({
      type: "l4",
      l3Id,
      l4Id,
      hasChildren: false,
    });
  };

  const confirmDelete = () => {
    if (!deleteConfirm) return;

    if (deleteConfirm.type === "l3") {
      deleteL3(l1Id, currentL2.id, deleteConfirm.l3Id);
      toast.success(language === "PT" ? "L3 excluído com sucesso" : "L3 deleted successfully");
    } else if (deleteConfirm.type === "l4" && deleteConfirm.l4Id) {
      deleteL4(l1Id, currentL2.id, deleteConfirm.l3Id, deleteConfirm.l4Id);
      toast.success(language === "PT" ? "L4 excluído com sucesso" : "L4 deleted successfully");
    }
    setDeleteConfirm(null);
  };

  const getProcessCountForL4 = (l4Name: string) => {
    return processes.filter((p) => p.l4 === l4Name).length;
  };

  const handleNavigateToProcesses = (l4Name: string) => {
    navigate(`/processes?l4=${encodeURIComponent(l4Name)}`);
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleDateString(language === "PT" ? "pt-BR" : "en-US");
  };

  return (
    <div className="h-full overflow-y-auto" style={{ backgroundColor: "#FFFFFF" }}>
      {/* L2 Header */}
      <div
        className="p-6 border-b flex items-center justify-between"
        style={{ borderColor: "#E5EAED" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ backgroundColor: "#A8D9E8", color: "#0C7A94" }}
            >
              L2
            </span>
            <h2 className="text-xl font-semibold" style={{ color: "#272727" }}>
              {currentL2.name}
            </h2>
            <span className="text-sm" style={{ color: "#666666" }}>
              ({currentL2.l3Processes.length} L3s)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem onClick={onEditL2}>
                {language === "PT" ? "Editar" : "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteL2} className="text-destructive">
                {language === "PT" ? "Excluir" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button size="sm" variant="outline" onClick={onEditL2} className="gap-1">
            <Edit2 size={14} />
            {language === "PT" ? "Editar" : "Edit"}
          </Button>
        </div>
      </div>

      {/* L2 Overview */}
      <div className="p-6 border-b" style={{ borderColor: "#E5EAED" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#666666" }}>
              {language === "PT" ? "Descrição" : "Description"}
            </p>
            <p className="text-sm" style={{ color: "#272727" }}>
              {currentL2.description || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#666666" }}>
              {language === "PT" ? "Responsável" : "Owner"}
            </p>
            <p className="text-sm" style={{ color: "#272727" }}>
              {currentL2.responsible || "-"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#666666" }}>
              Status
            </p>
            <Badge
              variant="secondary"
              className="text-xs"
              style={{ backgroundColor: "#A8D9E8", color: "#0C7A94" }}
            >
              {language === "PT" ? "Ativo" : "Active"}
            </Badge>
          </div>
          <div>
            <p className="text-xs font-medium mb-1" style={{ color: "#666666" }}>
              L3s
            </p>
            <p className="text-sm font-semibold" style={{ color: "#2BA0B8" }}>
              {currentL2.l3Processes.length}
            </p>
          </div>
        </div>
      </div>

      {/* L3 List Header */}
      <div className="p-6 pb-3 flex items-center justify-between">
        <h3 className="font-semibold" style={{ color: "#272727" }}>
          L3
        </h3>
        <Button size="sm" onClick={handleAddL3} className="gap-1" style={{ backgroundColor: "#2BA0B8" }}>
          <Plus size={14} />
          {language === "PT" ? "Adicionar L3" : "Add L3"}
        </Button>
      </div>

      {/* L3 Accordion List */}
      <div className="px-6 pb-6 space-y-3">
        {currentL2.l3Processes.length === 0 ? (
          <div
            className="text-center py-12 rounded-lg border border-dashed"
            style={{ borderColor: "#E5EAED" }}
          >
            <p className="text-muted-foreground mb-3">
              {language === "PT" ? "Nenhum L3 cadastrado" : "No L3 registered"}
            </p>
            <Button size="sm" variant="outline" onClick={handleAddL3} className="gap-1">
              <Plus size={14} />
              {language === "PT" ? "Criar primeiro L3" : "Create first L3"}
            </Button>
          </div>
        ) : (
          currentL2.l3Processes.map((l3) => (
            <L3AccordionItem
              key={l3.id}
              l3={l3}
              isExpanded={expandedL3s.has(l3.id)}
              onToggle={() => toggleL3(l3.id)}
              onEdit={() => handleEditL3(l3)}
              onDelete={() => handleDeleteL3(l3)}
              onAddL4={() => handleAddL4(l3.id)}
              onEditL4={(l4) => handleEditL4(l3.id, l4)}
              onDeleteL4={(l4Id) => handleDeleteL4(l3.id, l4Id)}
              getProcessCount={getProcessCountForL4}
              onNavigateToProcesses={handleNavigateToProcesses}
            />
          ))
        )}
      </div>

      {/* Modals */}
      <CreateEditL3Modal
        isOpen={isL3ModalOpen}
        onClose={() => setIsL3ModalOpen(false)}
        l1Id={l1Id}
        l2Id={currentL2.id}
        editingL3={editingL3}
      />

      {editingL4 && (
        <CreateEditL4Modal
          isOpen={isL4ModalOpen}
          onClose={() => {
            setIsL4ModalOpen(false);
            setEditingL4(null);
          }}
          l1Id={l1Id}
          l2Id={currentL2.id}
          l3Id={editingL4.l3Id}
          editingL4={editingL4.l4}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Confirmar exclusão" : "Confirm deletion"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteConfirm?.hasChildren
                ? language === "PT"
                  ? "Este L3 possui L4s que também serão excluídos. Deseja continuar?"
                  : "This L3 has L4s that will also be deleted. Continue?"
                : language === "PT"
                ? "Tem certeza que deseja excluir este item?"
                : "Are you sure you want to delete this item?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{language === "PT" ? "Cancelar" : "Cancel"}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

interface L3AccordionItemProps {
  l3: L3Process;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddL4: () => void;
  onEditL4: (l4: L4Task) => void;
  onDeleteL4: (l4Id: string) => void;
  getProcessCount: (l4Name: string) => number;
  onNavigateToProcesses: (l4Name: string) => void;
}

function L3AccordionItem({
  l3,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  onAddL4,
  onEditL4,
  onDeleteL4,
  getProcessCount,
  onNavigateToProcesses,
}: L3AccordionItemProps) {
  const { language } = useLanguage();

  return (
    <div
      className="rounded-lg border overflow-hidden"
      style={{
        borderColor: "#E5EAED",
        boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
      }}
    >
      {/* L3 Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        style={{ backgroundColor: isExpanded ? "#F8FAFB" : "#FFFFFF" }}
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {isExpanded ? (
            <ChevronDown size={18} style={{ color: "#2BA0B8" }} />
          ) : (
            <ChevronRight size={18} style={{ color: "#666666" }} />
          )}
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-semibold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: "#D4EEF3", color: "#0C7A94" }}
              >
                L3
              </span>
              <span className="font-medium" style={{ color: "#272727" }}>
                {l3.name}
              </span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{ backgroundColor: "#A8D9E8", color: "#0C7A94" }}
              >
                {l3.l4Tasks.length} L4s
              </span>
            </div>
            {l3.description && (
              <p className="text-xs mt-1" style={{ color: "#666666" }}>
                {l3.description}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
              {language === "PT" ? "Editar" : "Edit"}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-destructive"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* L4 Tasks (expanded content) */}
      {isExpanded && (
        <div className="p-4 pt-0" style={{ backgroundColor: "#F8FAFB" }}>
          <div className="border-t pt-4 space-y-2" style={{ borderColor: "#E5EAED" }}>
            {l3.l4Tasks.length === 0 ? (
              <div className="text-center py-4 text-sm text-muted-foreground">
                {language === "PT" ? "Nenhum L4" : "No L4"}
              </div>
            ) : (
              l3.l4Tasks.map((l4) => (
                <L4TaskItem
                  key={l4.id}
                  l4={l4}
                  processCount={getProcessCount(l4.name)}
                  onEdit={() => onEditL4(l4)}
                  onDelete={() => onDeleteL4(l4.id)}
                  onNavigate={() => onNavigateToProcesses(l4.name)}
                />
              ))
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => { e.stopPropagation(); onAddL4(); }}
              className="w-full gap-1 text-xs mt-2"
              style={{ color: "#2BA0B8" }}
            >
              <Plus size={14} />
              {language === "PT" ? "Adicionar L4" : "Add L4"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface L4TaskItemProps {
  l4: L4Task;
  processCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onNavigate: () => void;
}

function L4TaskItem({ l4, processCount, onEdit, onDelete, onNavigate }: L4TaskItemProps) {
  const { language } = useLanguage();

  return (
    <div
      className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors hover:shadow-sm"
      style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5EAED" }}
      onClick={onNavigate}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium" style={{ color: "#272727" }}>
          • {l4.name}
        </span>
        <Badge
          variant="secondary"
          className="text-xs px-1.5 py-0"
          style={{
            backgroundColor: l4.status === "active" ? "#D4F5E9" : "#F5E6D4",
            color: l4.status === "active" ? "#0C9456" : "#946B0C",
          }}
        >
          {l4.status === "active" 
            ? (language === "PT" ? "Ativo" : "Active")
            : (language === "PT" ? "Inativo" : "Inactive")}
        </Badge>
        <Badge
          variant="outline"
          className="text-xs px-1.5 py-0"
          style={{ borderColor: "#2BA0B8", color: "#2BA0B8" }}
        >
          {processCount} {language === "PT" ? "docs" : "docs"}
        </Badge>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            {language === "PT" ? "Editar" : "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="text-destructive"
          >
            {language === "PT" ? "Excluir" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
