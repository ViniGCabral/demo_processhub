import { useState, useEffect } from "react";
import { Bookmark, Search, ChevronDown, ExternalLink, Zap, TrendingUp, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { L1Process } from "@/stores/valueChainStore";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SavedUseCase {
  id: string;
  use_case_id: string;
  l1_id: string | null;
  l1_name: string | null;
  l2_name: string | null;
  l3_name: string | null;
  l4_name: string | null;
  created_at: string;
  use_case: {
    id: string;
    title: string;
    description: string | null;
    category: string | null;
    effort: string | null;
    impact: string | null;
    impacted_processes_count: number | null;
  } | null;
}

const effortMap: Record<string, { label: string; color: string; width: string }> = {
  very_low: { label: "Very Low", color: "bg-green-400", width: "w-1/5" },
  low: { label: "Low", color: "bg-yellow-400", width: "w-2/5" },
  high: { label: "High", color: "bg-orange-500", width: "w-3/5" },
  very_high: { label: "Very High", color: "bg-red-500", width: "w-4/5" },
};

const impactMap: Record<string, { label: string; color: string; width: string }> = {
  very_low: { label: "Very Low", color: "bg-blue-300", width: "w-1/5" },
  low: { label: "Low", color: "bg-blue-400", width: "w-2/5" },
  high: { label: "High", color: "bg-emerald-500", width: "w-3/5" },
  very_high: { label: "Very High", color: "bg-emerald-600", width: "w-4/5" },
};

interface SavedUseCasesPanelProps {
  l1: L1Process;
  onClose: () => void;
}

export function SavedUseCasesPanel({ l1, onClose }: SavedUseCasesPanelProps) {
  const { language } = useLanguage();
  const [savedCases, setSavedCases] = useState<SavedUseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLayer, setFilterLayer] = useState<string>("all");

  // Build layer options from chain structure
  const layerOptions: { value: string; label: string }[] = [
    { value: "all", label: language === "PT" ? "Todos os níveis" : "All levels" },
  ];

  l1.l2Processes.forEach((l2) => {
    layerOptions.push({ value: `l2:${l2.name}`, label: `L2 — ${l2.name}` });
    l2.l3Processes.forEach((l3) => {
      layerOptions.push({ value: `l3:${l3.name}`, label: `  L3 — ${l3.name}` });
      l3.l4Tasks.forEach((l4) => {
        layerOptions.push({ value: `l4:${l4.name}`, label: `    L4 — ${l4.name}` });
      });
    });
  });

  const fetchSaved = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data, error } = await supabase
      .from("saved_use_cases")
      .select("*, use_case:use_cases(id, title, description, category, effort, impact, impacted_processes_count)")
      .eq("user_id", user.id)
      .eq("l1_id", l1.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSavedCases(data as unknown as SavedUseCase[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [l1.id]);

  const handleRemove = async (savedId: string) => {
    const { error } = await supabase.from("saved_use_cases").delete().eq("id", savedId);
    if (!error) {
      setSavedCases((prev) => prev.filter((s) => s.id !== savedId));
      toast.success(language === "PT" ? "Caso de uso removido dos salvos" : "Use case removed from saved");
    }
  };

  // Filter logic
  const filtered = savedCases.filter((s) => {
    const uc = s.use_case;
    if (!uc) return false;

    const matchSearch =
      !search ||
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      (uc.description || "").toLowerCase().includes(search.toLowerCase());

    if (filterLayer === "all") return matchSearch;

    const [level, name] = filterLayer.split(":");
    if (level === "l2") return matchSearch && s.l2_name === name;
    if (level === "l3") return matchSearch && s.l3_name === name;
    if (level === "l4") return matchSearch && s.l4_name === name;

    return matchSearch;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-[#0C1BA8]" />
          <h3 className="font-semibold text-[#272727]">
            {language === "PT" ? "Casos de Uso Salvos" : "Saved Use Cases"}
          </h3>
          <span className="text-xs text-[#A5A7B0]">({savedCases.length})</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm text-[#A5A7B0] hover:text-[#272727]"
          onClick={onClose}
        >
          <X size={16} />
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A5A7B0]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "PT" ? "Buscar caso de uso..." : "Search use case..."}
            className="pl-9 rounded-sm border-[#A5A7B0]/30 bg-white"
          />
        </div>
        <Select value={filterLayer} onValueChange={setFilterLayer}>
          <SelectTrigger className="w-[220px] rounded-sm border-[#A5A7B0]/30 bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-sm">
            {layerOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-sm text-[#A5A7B0]">
          {language === "PT" ? "Carregando..." : "Loading..."}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center border border-dashed border-[#A5A7B0]/30 rounded-sm bg-white">
          <Bookmark className="h-8 w-8 mx-auto mb-3 text-[#A5A7B0]" />
          <p className="text-sm text-[#A5A7B0]">
            {language === "PT"
              ? "Nenhum caso de uso salvo encontrado"
              : "No saved use cases found"}
          </p>
          <p className="text-xs text-[#A5A7B0] mt-1">
            {language === "PT"
              ? "Salve casos de uso na tela de detalhamento para vê-los aqui"
              : "Save use cases from the detail page to see them here"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-sm border border-[#A5A7B0]/30 overflow-hidden divide-y divide-[#A5A7B0]/15">
          {filtered.map((s) => {
            const uc = s.use_case;
            if (!uc) return null;
            const effort = effortMap[uc.effort || "high"] || effortMap.high;
            const impact = impactMap[uc.impact || "high"] || impactMap.high;

            return (
              <div key={s.id} className="px-4 py-3.5 hover:bg-[#f9f9f9] transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-[10px] rounded-sm bg-[#c9dcf2] text-[#0C1BA8] border-0 font-bold">
                        {uc.category || "—"}
                      </Badge>
                      {s.l2_name && (
                        <span className="text-[10px] text-[#A5A7B0]">
                          {s.l2_name}{s.l3_name ? ` › ${s.l3_name}` : ""}{s.l4_name ? ` › ${s.l4_name}` : ""}
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-[#272727] truncate">{uc.title}</h4>
                    {uc.description && (
                      <p className="text-xs text-[#A5A7B0] mt-0.5 line-clamp-2">{uc.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(s.id)}
                    className="h-7 w-7 flex items-center justify-center rounded-sm opacity-0 group-hover:opacity-100 hover:bg-red-50 text-[#A5A7B0] hover:text-red-500 transition-all shrink-0"
                    title={language === "PT" ? "Remover dos salvos" : "Remove from saved"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Effort & Impact */}
                <div className="flex items-center gap-5 mt-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-[#A5A7B0]" />
                    <span className="text-[#A5A7B0]">Effort</span>
                    <div className="w-16 h-1.5 bg-[#A5A7B0]/15 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", effort.color, effort.width)} />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-[#A5A7B0]" />
                    <span className="text-[#A5A7B0]">Impact</span>
                    <div className="w-16 h-1.5 bg-[#A5A7B0]/15 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", impact.color, impact.width)} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
