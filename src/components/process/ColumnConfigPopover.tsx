import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTaxonomy, DEFAULT_TAXONOMY_LABELS, TaxonomyLevel } from "@/stores/taxonomyStore";

export type ColumnId = 
  | "area" | "l1" | "l2" | "l3" | "l4" 
  | "name" | "description" 
  | "automation" | "dataIntegrity" | "governance"
  | "executor" | "approver"
  | "frequency" | "avgTime" | "lastUpdate"
  | "status";

interface ColumnConfig {
  id: ColumnId;
  label: string;
  labelPT: string;
  fixed: boolean;
  width: string;
  minWidth?: string;
}

export const COLUMN_ORDER: ColumnConfig[] = [
  { id: "area", label: "Area", labelPT: "Área", fixed: true, width: "100px" },
  { id: "l1", label: "L1 – Macroprocess", labelPT: "L1 – Macroprocesso", fixed: false, width: "140px" },
  { id: "l2", label: "L2 – Process", labelPT: "L2 – Processo", fixed: false, width: "140px" },
  { id: "l3", label: "L3 – Subprocess", labelPT: "L3 – Subprocesso", fixed: false, width: "120px" },
  { id: "l4", label: "L4 – Activity", labelPT: "L4 – Atividade", fixed: false, width: "120px" },
  { id: "name", label: "Process Name", labelPT: "Nome do Processo", fixed: true, width: "280px" },
  { id: "description", label: "Description", labelPT: "Descrição", fixed: true, width: "260px" },
  { id: "automation", label: "Automation", labelPT: "Automação", fixed: false, width: "110px" },
  { id: "dataIntegrity", label: "Data Integrity", labelPT: "Data Integrity", fixed: false, width: "110px" },
  { id: "governance", label: "Governance", labelPT: "Governança", fixed: false, width: "110px" },
  { id: "executor", label: "Executor", labelPT: "Executor", fixed: false, width: "140px" },
  { id: "approver", label: "Approver", labelPT: "Aprovador", fixed: false, width: "140px" },
  { id: "frequency", label: "Frequency", labelPT: "Frequência", fixed: false, width: "100px" },
  { id: "avgTime", label: "Avg Time", labelPT: "Tempo Médio", fixed: false, width: "100px" },
  { id: "lastUpdate", label: "Last Update", labelPT: "Última Atualização", fixed: false, width: "130px" },
  { id: "status", label: "Status", labelPT: "Status", fixed: true, width: "80px" },
];

const STORAGE_KEY = "processhub_columns_config";

const COLUMN_GROUPS = {
  valueChain: ["l1", "l2", "l3", "l4"] as ColumnId[],
  health: ["automation", "dataIntegrity", "governance"] as ColumnId[],
  responsible: ["executor", "approver"] as ColumnId[],
  other: ["frequency", "avgTime", "lastUpdate"] as ColumnId[],
};

export function getStoredColumns(): ColumnId[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.enabledColumns || [];
    }
  } catch (e) {
    console.error("Error reading column config:", e);
  }
  return [];
}

export function saveColumns(columns: ColumnId[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ enabledColumns: columns }));
  } catch (e) {
    console.error("Error saving column config:", e);
  }
}

export function clearColumns(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error clearing column config:", e);
  }
}

export function getVisibleColumns(enabledOptional: ColumnId[]): ColumnConfig[] {
  return COLUMN_ORDER.filter(col => col.fixed || enabledOptional.includes(col.id));
}

const TAXONOMY_COLUMNS: ColumnId[] = ["l1", "l2", "l3", "l4"];

/** Column labels that follow the taxonomy naming saved in Settings. */
export function useColumnLabel() {
  const { language } = useLanguage();
  const { label } = useTaxonomy();

  return (col: ColumnConfig) => {
    const base = language === "PT" ? col.labelPT : col.label;
    if (!TAXONOMY_COLUMNS.includes(col.id)) return base;

    const level = col.id as TaxonomyLevel;
    const custom = label(level);
    const isDefault = custom === DEFAULT_TAXONOMY_LABELS[level];
    // "L1 – Macroprocesso" → keeps the descriptor only while the default code is used
    return isDefault ? base : custom;
  };
}

interface ColumnConfigPopoverProps {
  enabledColumns: ColumnId[];
  onApply: (columns: ColumnId[]) => void;
}

export function ColumnConfigPopover({ enabledColumns, onApply }: ColumnConfigPopoverProps) {
  const { language } = useLanguage();
  const { maxLevel } = useTaxonomy();
  const columnLabel = useColumnLabel();
  const [open, setOpen] = useState(false);
  const valueChainColumns = COLUMN_GROUPS.valueChain.filter(
    (c) => !((c === "l3" && maxLevel < 3) || (c === "l4" && maxLevel < 4))
  );
  const [tempSelection, setTempSelection] = useState<ColumnId[]>(enabledColumns);

  useEffect(() => {
    if (open) {
      setTempSelection(enabledColumns);
    }
  }, [open, enabledColumns]);

  const toggleColumn = (colId: ColumnId) => {
    setTempSelection(prev =>
      prev.includes(colId)
        ? prev.filter(id => id !== colId)
        : [...prev, colId]
    );
  };

  const handleApply = () => {
    onApply(tempSelection);
    setOpen(false);
  };

  const handleReset = () => {
    setTempSelection([]);
  };

  const activeCount = enabledColumns.length;
  const hasCustomColumns = activeCount > 0;

  const renderCheckboxGroup = (title: string, columnIds: ColumnId[]) => (
    <div className="mb-4">
      <p 
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: "#A5A7B0", fontSize: "10px", letterSpacing: "0.5px" }}
      >
        {title}
      </p>
      <div className="space-y-2">
        {columnIds.map(colId => {
          const col = COLUMN_ORDER.find(c => c.id === colId);
          if (!col) return null;
          return (
            <label 
              key={colId} 
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-md -mx-2 transition-colors"
            >
              <Checkbox
                checked={tempSelection.includes(colId)}
                onCheckedChange={() => toggleColumn(colId)}
                className="border-gray-300 data-[state=checked]:bg-[#0C1BA8] data-[state=checked]:border-[#0C1BA8]"
              />
              <span style={{ fontSize: "13px", color: "#272727" }}>
                {columnLabel(col)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            color: hasCustomColumns ? "#0C1BA8" : "#6B7280",
            backgroundColor: hasCustomColumns ? "#EEF0FF" : "transparent",
            border: hasCustomColumns ? "1px solid #0C1BA8" : "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            if (!hasCustomColumns) {
              e.currentTarget.style.borderColor = "#0C1BA8";
              e.currentTarget.style.color = "#0C1BA8";
            }
          }}
          onMouseLeave={(e) => {
            if (!hasCustomColumns) {
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }
          }}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{language === "PT" ? "Colunas" : "Columns"}</span>
          {hasCustomColumns && (
            <span 
              className="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded"
              style={{ 
                backgroundColor: "#0C1BA8", 
                color: "white",
                fontSize: "10px"
              }}
            >
              +{activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 p-0" 
        align="start"
        style={{ 
          border: "1px solid #E8E8EA",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}
      >
        <div 
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ borderColor: "#E8E8EA" }}
        >
          <span style={{ fontSize: "14px", fontWeight: 600, color: "#272727" }}>
            {language === "PT" ? "Personalizar colunas" : "Customize columns"}
          </span>
          <button 
            onClick={() => setOpen(false)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-4 w-4" style={{ color: "#6B7280" }} />
          </button>
        </div>
        
        <div className="px-4 py-3 max-h-[360px] overflow-y-auto">
          {renderCheckboxGroup(
            language === "PT" ? "Cadeia de Valor" : "Value Chain",
            valueChainColumns
          )}
          {renderCheckboxGroup(
            language === "PT" ? "Saúde do Processo" : "Process Health",
            COLUMN_GROUPS.health
          )}
          {renderCheckboxGroup(
            language === "PT" ? "Responsáveis" : "Responsible",
            COLUMN_GROUPS.responsible
          )}
          {renderCheckboxGroup(
            language === "PT" ? "Outros" : "Other",
            COLUMN_GROUPS.other
          )}
        </div>

        <div 
          className="flex items-center justify-between px-4 py-3 border-t"
          style={{ borderColor: "#E8E8EA", backgroundColor: "#FAFAFA" }}
        >
          <button
            onClick={handleReset}
            className="text-sm hover:underline transition-colors"
            style={{ color: "#6B7280" }}
          >
            {language === "PT" ? "Restaurar padrão" : "Reset to default"}
          </button>
          <Button
            onClick={handleApply}
            size="sm"
            style={{ 
              backgroundColor: "#0C1BA8", 
              color: "white",
              borderRadius: "8px",
              fontSize: "13px"
            }}
          >
            {language === "PT" ? "Aplicar" : "Apply"}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
