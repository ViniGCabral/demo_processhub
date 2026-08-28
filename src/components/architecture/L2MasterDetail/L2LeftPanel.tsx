import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { L2Process } from "@/stores/valueChainStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface L2LeftPanelProps {
  l2Processes: L2Process[];
  selectedL2Id: string | null;
  onSelectL2: (l2Id: string) => void;
  onAddL2: () => void;
  onEditL2: (l2: L2Process) => void;
  onDeleteL2: (l2: L2Process) => void;
  onDuplicateL2: (l2: L2Process) => void;
}

export function L2LeftPanel({
  l2Processes,
  selectedL2Id,
  onSelectL2,
  onAddL2,
  onEditL2,
  onDeleteL2,
  onDuplicateL2,
}: L2LeftPanelProps) {
  const { language } = useLanguage();

  return (
    <div
      className="h-full flex flex-col border-r"
      style={{ 
        backgroundColor: "#F8FAFB",
        borderColor: "#E5EAED",
      }}
    >
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#E5EAED" }}>
        <h3 className="font-semibold text-sm" style={{ color: "#272727" }}>
          L2
        </h3>
        <Button
          size="sm"
          onClick={onAddL2}
          className="h-7 gap-1 text-xs"
          style={{ backgroundColor: "#2BA0B8" }}
        >
          <Plus size={14} />
          {language === "PT" ? "Novo" : "Add"}
        </Button>
      </div>

      {/* L2 List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {l2Processes.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-muted-foreground mb-3">
              {language === "PT"
                ? "Nenhum L2"
                : "No L2"}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={onAddL2}
              className="gap-1 text-xs"
            >
              <Plus size={14} />
              {language === "PT" ? "Criar primeiro" : "Create first"}
            </Button>
          </div>
        ) : (
          l2Processes.map((l2) => (
            <L2ListItem
              key={l2.id}
              l2={l2}
              isSelected={selectedL2Id === l2.id}
              onSelect={() => onSelectL2(l2.id)}
              onEdit={() => onEditL2(l2)}
              onDelete={() => onDeleteL2(l2)}
              onDuplicate={() => onDuplicateL2(l2)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface L2ListItemProps {
  l2: L2Process;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

function L2ListItem({ l2, isSelected, onSelect, onEdit, onDelete, onDuplicate }: L2ListItemProps) {
  const { language } = useLanguage();

  return (
    <div
      className={cn(
        "group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors",
        isSelected ? "shadow-sm" : ""
      )}
      style={{
        backgroundColor: isSelected ? "#D4EEF3" : "transparent",
      }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "#F0FAFB";
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      <div className="flex-1 min-w-0">
        <p
          className="font-medium text-sm truncate"
          style={{ color: "#272727" }}
        >
          {l2.name}
        </p>
        <span
          className="text-xs px-1.5 py-0.5 rounded-full mt-1 inline-block"
          style={{
            backgroundColor: "#A8D9E8",
            color: "#0C7A94",
          }}
        >
          {l2.l3Processes.length} L3s
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "#666666" }}
          >
            <MoreHorizontal size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            {language === "PT" ? "Editar" : "Edit"}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDuplicate(); }}>
            {language === "PT" ? "Duplicar" : "Duplicate"}
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
