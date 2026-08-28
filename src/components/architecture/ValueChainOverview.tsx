import { useState } from "react";
import { L1Process, useValueChainStore } from "@/stores/valueChainStore";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Pencil, Trash2, Copy, Sparkles } from "lucide-react";
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
import { CreateEditL1Modal } from "./modals/CreateEditL1Modal";
import { AIGenerationModal } from "./AIGenerationModal";
import { toast } from "sonner";

interface ValueChainOverviewProps {
  l1Processes: L1Process[];
  onL1Click: (l1: L1Process) => void;
  onGenerateAI: (option: "full" | "existing" | "new", targetL1Id?: string, newE2EName?: string) => void;
}

export function ValueChainOverview({ l1Processes, onL1Click, onGenerateAI }: ValueChainOverviewProps) {
  const { language } = useLanguage();
  const { addL1, updateL1, deleteL1 } = useValueChainStore();
  
  const [showL1Modal, setShowL1Modal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [editingL1, setEditingL1] = useState<L1Process | null>(null);
  const [deletingL1, setDeletingL1] = useState<L1Process | null>(null);

  const supportActivities = l1Processes.filter((l1) => l1.category === "SUPPORT");
  const primaryActivities = l1Processes.filter((l1) => l1.category === "PRIMARY");

  const getL1DisplayName = (l1: L1Process) => {
    return language === "PT" ? l1.namePT : l1.nameEN;
  };

  const countL2s = (l1: L1Process) => l1.l2Processes.length;

  const handleCreateL1 = () => {
    setEditingL1(null);
    setShowL1Modal(true);
  };

  const handleEditL1 = (l1: L1Process, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingL1(l1);
    setShowL1Modal(true);
  };

  const handleDeleteL1 = (l1: L1Process, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingL1(l1);
  };

  const handleDuplicateL1 = (l1: L1Process, e: React.MouseEvent) => {
    e.stopPropagation();
    addL1({
      nameEN: `${l1.nameEN} (Copy)`,
      namePT: `${l1.namePT} (Cópia)`,
      category: l1.category,
      description: l1.description,
    });
    toast.success(language === "PT" ? "L1 duplicado com sucesso!" : "L1 duplicated successfully!");
  };

  const confirmDeleteL1 = () => {
    if (deletingL1) {
      deleteL1(deletingL1.id);
      toast.success(language === "PT" ? "L1 removido com sucesso!" : "L1 deleted successfully!");
      setDeletingL1(null);
    }
  };

  const handleSaveL1 = (data: {
    nameEN: string;
    namePT: string;
    category: "SUPPORT" | "PRIMARY";
    description?: string;
  }) => {
    if (editingL1) {
      updateL1(editingL1.id, data);
      toast.success(language === "PT" ? "L1 atualizado com sucesso!" : "L1 updated successfully!");
    } else {
      addL1(data);
      toast.success(language === "PT" ? "L1 criado com sucesso!" : "L1 created successfully!");
    }
  };

  const renderL1Card = (l1: L1Process, isPrimary: boolean) => (
    <div key={l1.id} className="relative group">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => onL1Click(l1)}
            className={`w-full group/card relative p-5 rounded-sm text-left transition-all duration-150 border ${
              isPrimary
                ? "bg-[#0C1BA8] border-[#0C1BA8] hover:bg-[#04223D]"
                : "bg-[#c9dcf2] border-[#c9dcf2]/80 hover:border-[#0C1BA8]/30"
            }`}
          >
            <h4
              className={`font-medium text-sm mb-1 ${
                isPrimary ? "text-white" : "text-[#272727]"
              }`}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide opacity-70 mr-1.5">L1</span>
              {getL1DisplayName(l1)}
            </h4>
            <span
              className={`text-xs ${isPrimary ? "text-white/70" : "text-[#272727]/60"}`}
            >
              [{countL2s(l1)} {language === "PT" ? "macroprocessos" : "macroprocesses"}]
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="rounded-sm">
          <p>
            {language === "PT"
              ? "Clique para explorar processos L2"
              : "Click to explore L2 processes"}
          </p>
        </TooltipContent>
      </Tooltip>

      {/* Context Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className={`absolute top-2 right-2 p-1.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 ${
              isPrimary ? "hover:bg-white/20" : "hover:bg-black/10"
            }`}
          >
            <MoreHorizontal className={`h-4 w-4 ${isPrimary ? "text-white" : "text-[#272727]"}`} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-sm">
          <DropdownMenuItem onClick={(e) => handleEditL1(l1, e as unknown as React.MouseEvent)}>
            <Pencil className="h-4 w-4 mr-2" />
            {language === "PT" ? "Editar" : "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => handleDuplicateL1(l1, e as unknown as React.MouseEvent)}>
            <Copy className="h-4 w-4 mr-2" />
            {language === "PT" ? "Duplicar" : "Duplicate"}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleDeleteL1(l1, e as unknown as React.MouseEvent)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {language === "PT" ? "Excluir" : "Delete"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  return (
    <div className="w-full">
      {/* Buttons Row */}
      <div className="flex justify-end gap-3 mb-4">
        <Button onClick={() => setShowAIModal(true)} variant="outline" size="sm" className="rounded-sm border-[#A5A7B0]/30 text-[#272727]">
          <Sparkles className="h-4 w-4 mr-2" />
          {language === "PT" ? "Gerar com IA" : "Generate with AI"}
        </Button>
        <Button onClick={handleCreateL1} size="sm" className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white">
          <Plus className="h-4 w-4 mr-2" />
          {language === "PT" ? "Adicionar End to End" : "Add End to End"}
        </Button>
      </div>

      {/* Support Activities */}
      <div className="mb-6">
        <h3 className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider mb-3">
          {language === "PT" ? "Atividades de Suporte" : "Support Activities"}
        </h3>
        {supportActivities.length > 0 ? (
          <div className="grid grid-cols-4 gap-3">
            {supportActivities.map((l1) => renderL1Card(l1, false))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-[#A5A7B0]/30 rounded-sm bg-white">
            <p className="text-[#A5A7B0] text-sm">
              {language === "PT"
                ? "Nenhuma atividade de suporte cadastrada"
                : "No support activities registered"}
            </p>
          </div>
        )}
      </div>

      {/* Primary Activities */}
      <div className="relative">
        <h3 className="text-[11px] font-bold text-[#A5A7B0] uppercase tracking-wider mb-3">
          {language === "PT" ? "Atividades Primárias" : "Primary Activities"}
        </h3>
        {primaryActivities.length > 0 ? (
          <div className="grid grid-cols-5 gap-3">
            {primaryActivities.map((l1) => renderL1Card(l1, true))}
          </div>
        ) : (
          <div className="text-center py-8 border border-dashed border-[#A5A7B0]/30 rounded-sm bg-white">
            <p className="text-[#A5A7B0] text-sm">
              {language === "PT"
                ? "Nenhuma atividade primária cadastrada"
                : "No primary activities registered"}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 flex items-center gap-6 text-sm text-[#A5A7B0]">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-[#c9dcf2]" />
          <span>{language === "PT" ? "Atividades de Suporte" : "Support Activities"}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-sm bg-[#0C1BA8]" />
          <span>{language === "PT" ? "Atividades Primárias" : "Primary Activities"}</span>
        </div>
      </div>

      {/* L1 Modal */}
      <CreateEditL1Modal
        open={showL1Modal}
        onOpenChange={setShowL1Modal}
        onSave={handleSaveL1}
        editingL1={editingL1}
      />

      {/* AI Generation Modal */}
      <AIGenerationModal
        open={showAIModal}
        onOpenChange={setShowAIModal}
        existingL1s={l1Processes}
        onGenerate={onGenerateAI}
      />
      <AlertDialog open={!!deletingL1} onOpenChange={() => setDeletingL1(null)}>
        <AlertDialogContent className="rounded-sm">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "PT" ? "Excluir L1?" : "Delete L1?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deletingL1 && deletingL1.l2Processes.length > 0
                ? language === "PT"
                  ? `Este L1 possui ${deletingL1.l2Processes.length} L2(s). Todos serão removidos. Esta ação não pode ser desfeita.`
                  : `This L1 has ${deletingL1.l2Processes.length} L2(s). All will be removed. This action cannot be undone.`
                : language === "PT"
                ? "Esta ação não pode ser desfeita."
                : "This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-sm">
              {language === "PT" ? "Cancelar" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteL1}
              className="rounded-sm bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {language === "PT" ? "Excluir" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
