import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, GripVertical, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { L3Process, L4Task, useValueChainStore } from "@/stores/valueChainStore";
import { useProcessStore } from "@/stores/processStore";
import { CreateEditL4Modal } from "./modals/CreateEditL4Modal";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { Badge } from "@/components/ui/badge";

interface L3DetailsViewProps {
  l1Id: string;
  l2Id: string;
  l3: L3Process;
}

interface SortableL4CardProps {
  l4: L4Task;
  processCount: number;
  onEdit: () => void;
  onDelete: () => void;
  onNavigateToProcesses: () => void;
}

function SortableL4Card({ l4, processCount, onEdit, onDelete, onNavigateToProcesses }: SortableL4CardProps) {
  const { language } = useLanguage();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: l4.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-[#C0E0E8] rounded-lg p-3 flex items-start gap-2 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onNavigateToProcesses}
    >
      <button
        {...attributes}
        {...listeners}
        className="mt-0.5 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical size={16} />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[#272727] truncate">
            <span className="text-xs font-semibold text-[#0C7A94] mr-1.5">L4</span>
            {l4.name}
          </p>
          <Badge 
            variant="secondary" 
            className="text-xs px-1.5 py-0 h-5 bg-primary/10 text-primary hover:bg-primary/20"
          >
            {processCount}
          </Badge>
        </div>
        {l4.description && (
          <p className="text-xs text-[#666666] truncate mt-0.5">{l4.description}</p>
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal size={14} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            {language === "PT" ? "Editar" : "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-destructive">
            {language === "PT" ? "Excluir" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function L3DetailsView({ l1Id, l2Id, l3 }: L3DetailsViewProps) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { l1Processes, deleteL4 } = useValueChainStore();
  const { processes } = useProcessStore();
  
  // Get fresh L3 data from store
  const currentL3 = l1Processes
    .find((l1) => l1.id === l1Id)
    ?.l2Processes.find((l2) => l2.id === l2Id)
    ?.l3Processes.find((l3p) => l3p.id === l3.id) || l3;

  // Count processes for each L4
  const getProcessCountForL4 = (l4Name: string) => {
    return processes.filter((p) => p.l4 === l4Name).length;
  };

  const handleNavigateToProcesses = (l4Name: string) => {
    navigate(`/processes?l4=${encodeURIComponent(l4Name)}`);
  };

  const [isL4ModalOpen, setIsL4ModalOpen] = useState(false);
  const [editingL4, setEditingL4] = useState<L4Task | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddL4 = () => {
    setEditingL4(null);
    setIsL4ModalOpen(true);
  };

  const handleEditL4 = (l4: L4Task) => {
    setEditingL4(l4);
    setIsL4ModalOpen(true);
  };

  const handleDeleteL4 = (l4Id: string) => {
    setDeleteConfirm(l4Id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteL4(l1Id, l2Id, l3.id, deleteConfirm);
      toast.success(language === "PT" ? "L4 excluído com sucesso" : "L4 deleted successfully");
      setDeleteConfirm(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentL3.l4Tasks.findIndex((t) => t.id === active.id);
      const newIndex = currentL3.l4Tasks.findIndex((t) => t.id === over.id);

      // For now, we'll just reorder within the same L3
      // Full cross-L3 drag would require more complex state management
      const newTasks = arrayMove(currentL3.l4Tasks, oldIndex, newIndex);
      
      // Update the store with new order
      // This would require adding a reorderL4 method to the store
      console.log("Reordered tasks:", newTasks);
    }
  };

  return (
    <div className="p-3 pt-0 space-y-3">
      {currentL3.l4Tasks.length === 0 ? (
        <div className="text-center py-4 bg-white/50 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground mb-2">
            {language === "PT" ? "Nenhum subprocesso cadastrado" : "No subprocess registered"}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={handleAddL4}
            className="gap-1 h-7 text-xs"
          >
            <Plus size={12} />
            {language === "PT" ? "Adicionar Subprocesso" : "Add Subprocess"}
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentL3.l4Tasks.map((t) => t.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 gap-2">
              {currentL3.l4Tasks.map((l4) => (
                <SortableL4Card
                  key={l4.id}
                  l4={l4}
                  processCount={getProcessCountForL4(l4.name)}
                  onEdit={() => handleEditL4(l4)}
                  onDelete={() => handleDeleteL4(l4.id)}
                  onNavigateToProcesses={() => handleNavigateToProcesses(l4.name)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Button
        size="sm"
        variant="ghost"
        onClick={handleAddL4}
        className="w-full gap-1 h-8 text-xs text-muted-foreground hover:text-foreground"
      >
        <Plus size={14} />
        {language === "PT" ? "Adicionar subprocesso" : "Add subprocess"}
      </Button>

      {/* Modal */}
      <CreateEditL4Modal
        isOpen={isL4ModalOpen}
        onClose={() => setIsL4ModalOpen(false)}
        l1Id={l1Id}
        l2Id={l2Id}
        l3Id={l3.id}
        editingL4={editingL4}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Confirmar exclusão" : "Confirm deletion"}
            </AlertDialogTitle>
          <AlertDialogDescription>
              {language === "PT"
                ? "Tem certeza que deseja excluir este subprocesso?"
                : "Are you sure you want to delete this subprocess?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
