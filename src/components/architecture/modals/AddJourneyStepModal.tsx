import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProcessStore } from "@/stores/processStore";
import { Search, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AddJourneyStepModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (process: {
    id: string;
    name: string;
    l1?: string;
    l2?: string;
    l3?: string;
    l4?: string;
    executor?: string;
    systems?: string[];
  }) => void;
  existingProcessNames: string[];
}

export function AddJourneyStepModal({
  open,
  onOpenChange,
  onAdd,
  existingProcessNames,
}: AddJourneyStepModalProps) {
  const { language } = useLanguage();
  const pt = language === "PT";
  const processes = useProcessStore((s) => s.processes);

  const [search, setSearch] = useState("");
  const [filterL1, setFilterL1] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Unique L1 names
  const l1Options = useMemo(() => {
    const set = new Set<string>();
    processes.forEach((p) => {
      if (p.l1) set.add(p.l1);
    });
    return Array.from(set).sort();
  }, [processes]);

  // Filtered processes
  const filtered = useMemo(() => {
    return processes
      .filter((p) => !p.isTemplate)
      .filter((p) => {
        if (filterL1 && p.l1 !== filterL1) return false;
        if (search) {
          const q = search.toLowerCase();
          return (
            p.name.toLowerCase().includes(q) ||
            (p.l1 && p.l1.toLowerCase().includes(q)) ||
            (p.l2 && p.l2.toLowerCase().includes(q)) ||
            (p.area && p.area.toLowerCase().includes(q))
          );
        }
        return true;
      });
  }, [processes, search, filterL1]);

  const handleAdd = () => {
    const proc = processes.find((p) => p.id === selectedId);
    if (!proc) return;
    onAdd({
      id: proc.id,
      name: proc.name,
      l1: proc.l1,
      l2: proc.l2,
      l3: proc.l3,
      l4: proc.l4,
      executor: proc.executor,
      systems: proc.systems,
    });
    setSelectedId(null);
    setSearch("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] rounded-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-[#272727]">
            {pt ? "Adicionar Etapa à Jornada" : "Add Step to Journey"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A5A7B0]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={pt ? "Buscar processos..." : "Search processes..."}
              className="pl-9 rounded-sm"
            />
          </div>

          {/* L1 filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterL1(null)}
              className={cn(
                "text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                !filterL1
                  ? "bg-[#0C1BA8] text-white border-[#0C1BA8]"
                  : "bg-white text-[#272727] border-[#A5A7B0]/40 hover:border-[#0C1BA8]"
              )}
            >
              {pt ? "Todos" : "All"}
            </button>
            {l1Options.map((l1) => (
              <button
                key={l1}
                onClick={() => setFilterL1(filterL1 === l1 ? null : l1)}
                className={cn(
                  "text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                  filterL1 === l1
                    ? "bg-[#0C1BA8] text-white border-[#0C1BA8]"
                    : "bg-white text-[#272727] border-[#A5A7B0]/40 hover:border-[#0C1BA8]"
                )}
              >
                {l1}
              </button>
            ))}
          </div>

          {/* Process list */}
          <div className="max-h-[300px] overflow-y-auto border border-[#A5A7B0]/20 rounded-sm divide-y divide-[#A5A7B0]/10">
            {filtered.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#A5A7B0]">
                {pt ? "Nenhum processo encontrado" : "No processes found"}
              </div>
            ) : (
              filtered.map((p) => {
                const isAlready = existingProcessNames.includes(p.name);
                const isSelected = selectedId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => !isAlready && setSelectedId(p.id)}
                    disabled={isAlready}
                    className={cn(
                      "w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors",
                      isAlready
                        ? "bg-[#f9f9f9] opacity-50 cursor-not-allowed"
                        : isSelected
                        ? "bg-[#f0f2ff] border-l-2 border-[#0C1BA8]"
                        : "hover:bg-[#f9f9f9]"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#272727] truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-[#A5A7B0] mt-0.5 flex items-center gap-1.5 flex-wrap">
                        {p.l1 && (
                          <span className="px-1.5 py-0.5 rounded-sm bg-[#c9dcf2] text-[#0C1BA8] font-semibold uppercase tracking-wide text-[9px]">
                            {p.l1}
                          </span>
                        )}
                        {p.l2 && <span>{p.l2}</span>}
                        {p.executor && (
                          <>
                            <span className="opacity-50">·</span>
                            <span>{p.executor}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {isAlready ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                    ) : isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#0C1BA8] flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    ) : (
                      <Plus className="h-4 w-4 text-[#A5A7B0] shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-sm"
          >
            {pt ? "Cancelar" : "Cancel"}
          </Button>
          <Button
            onClick={handleAdd}
            disabled={!selectedId}
            className="rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            {pt ? "Adicionar Etapa" : "Add Step"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
