import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, Search, Lightbulb, Bookmark, Zap, TrendingUp, Trash2, ExternalLink, LayoutGrid, List, Info } from "lucide-react";
import { TopBar } from "@/components/layout/TopBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import { useValueChainStore } from "@/stores/valueChainStore";
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
    source_reference: string | null;
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

interface SavedUseCasesProps {
  onLogout: () => void;
}

export function SavedUseCases({ onLogout }: SavedUseCasesProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { l1Processes } = useValueChainStore();

  const l1Id = searchParams.get("l1Id") || "";
  const l1 = l1Processes.find((p) => p.id === l1Id);

  const [savedCases, setSavedCases] = useState<SavedUseCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterLayer, setFilterLayer] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Build layer options from chain structure
  const layerOptions: { value: string; label: string }[] = [
    { value: "all", label: language === "PT" ? "Todos os níveis" : "All levels" },
  ];
  if (l1) {
    l1.l2Processes.forEach((l2) => {
      layerOptions.push({ value: `l2:${l2.name}`, label: `L2 — ${l2.name}` });
      l2.l3Processes.forEach((l3) => {
        layerOptions.push({ value: `l3:${l3.name}`, label: `L3 — ${l3.name}` });
        l3.l4Tasks.forEach((l4) => {
          layerOptions.push({ value: `l4:${l4.name}`, label: `L4 — ${l4.name}` });
        });
      });
    });
  }

  const fetchSaved = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let query = supabase
      .from("saved_use_cases")
      .select("*, use_case:use_cases(id, title, description, category, effort, impact, impacted_processes_count, source_reference)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (l1Id) {
      query = query.eq("l1_id", l1Id);
    }

    const { data, error } = await query;
    if (!error && data) {
      setSavedCases(data as unknown as SavedUseCase[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, [l1Id]);

  const handleRemove = async (savedId: string) => {
    const { error } = await supabase.from("saved_use_cases").delete().eq("id", savedId);
    if (!error) {
      setSavedCases((prev) => prev.filter((s) => s.id !== savedId));
      toast.success(language === "PT" ? "Caso de uso removido dos salvos" : "Use case removed from saved");
    }
  };

  const categories = ["IA", "Processo", "Sistemas"];

  const filtered = savedCases.filter((s) => {
    const uc = s.use_case;
    if (!uc) return false;
    const matchSearch = !search ||
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      (uc.description || "").toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || uc.category === filterCategory;
    let matchLayer = true;
    if (filterLayer !== "all") {
      const [level, name] = filterLayer.split(":");
      if (level === "l2") matchLayer = s.l2_name === name;
      else if (level === "l3") matchLayer = s.l3_name === name;
      else if (level === "l4") matchLayer = s.l4_name === name;
    }
    return matchSearch && matchCategory && matchLayer;
  });

  const handleExploreUseCases = () => {
    if (l1) {
      navigate(`/use-cases?level=l1&sourceId=${l1.id}&sourceName=${encodeURIComponent(l1.nameEN)}&l1Id=${l1.id}`);
    } else {
      navigate("/architecture");
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9] flex flex-col">
      <TopBar onLogout={onLogout} />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-[1200px] mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(l1Id ? `/architecture?l1Id=${l1Id}` : "/architecture")}
            className="flex items-center gap-1.5 text-sm mb-6 transition-colors hover:text-[#0C1BA8] text-[#A5A7B0]"
          >
            <ChevronLeft className="h-4 w-4" />
            {language === "PT" ? "Voltar para Arquitetura" : "Back to Architecture"}
          </button>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Bookmark className="h-6 w-6 text-[#0C1BA8]" />
              <h1 className="text-2xl font-semibold text-[#272727]">
                {language === "PT" ? "Casos de Uso Salvos" : "Saved Use Cases"}
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-sm text-[#A5A7B0]">
              {language === "PT" ? "Carregando..." : "Loading..."}
            </div>
          ) : savedCases.length === 0 ? (
            /* Empty state */
            <div className="py-20 text-center border border-dashed border-[#A5A7B0]/30 rounded-sm bg-white">
              <Bookmark className="h-12 w-12 mx-auto mb-4 text-[#A5A7B0]" />
              <h3 className="text-lg font-medium text-[#272727] mb-2">
                {language === "PT" ? "Nenhum caso de uso salvo" : "No saved use cases"}
              </h3>
              <p className="text-sm text-[#A5A7B0] mb-6 max-w-md mx-auto">
                {language === "PT"
                  ? "Explore casos de uso e salve os que mais te interessam para acessá-los rapidamente aqui."
                  : "Explore use cases and save the ones you like to quickly access them here."}
              </p>
              <Button
                className="gap-2 rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                onClick={handleExploreUseCases}
              >
                <Lightbulb size={16} />
                {language === "PT" ? "Explorar Casos de Uso" : "Explore Use Cases"}
              </Button>
            </div>
          ) : (
            /* List with sidebar filters */
            <div className="flex gap-6">
              {/* Left sidebar */}
              <div className="w-[260px] shrink-0 space-y-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A5A7B0]" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={language === "PT" ? "Buscar..." : "Search..."}
                    className="pl-9 rounded-sm border-[#A5A7B0]/30 bg-white"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#A5A7B0] uppercase tracking-wider mb-2">
                    {language === "PT" ? "Filtros" : "Filters"}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <Button
                        key={cat}
                        size="sm"
                        variant={filterCategory === cat ? "default" : "outline"}
                        className={cn(
                          "gap-1.5 text-xs h-8 rounded-full",
                          filterCategory === cat
                            ? "bg-[#0C1BA8] text-white border-[#0C1BA8]"
                            : "bg-white border-[#A5A7B0]/30 text-[#272727]"
                        )}
                        onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
                      >
                        <Info className="h-3 w-3" />
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Layer filter */}
                {layerOptions.length > 1 && (
                  <div>
                    <p className="text-xs font-semibold text-[#A5A7B0] uppercase tracking-wider mb-2">
                      {language === "PT" ? "Nível da Cadeia" : "Chain Level"}
                    </p>
                    <Select value={filterLayer} onValueChange={setFilterLayer}>
                      <SelectTrigger className="rounded-sm border-[#A5A7B0]/30 bg-white">
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
                )}

                <Button
                  className="w-full gap-2 rounded-sm bg-[#0C1BA8] hover:bg-[#04223D] text-white"
                  onClick={handleExploreUseCases}
                >
                  <Lightbulb className="h-4 w-4" />
                  {language === "PT" ? "Explorar Casos de Uso" : "Explore Use Cases"}
                </Button>

                <div>
                  <p className="text-xs font-semibold text-[#A5A7B0] uppercase tracking-wider mb-2">
                    {language === "PT" ? "Visualização" : "View"}
                  </p>
                  <div className="flex gap-1 bg-[#A5A7B0]/10 rounded-sm p-0.5">
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn("h-7 px-2 rounded-sm", viewMode === "list" && "bg-white shadow-sm")}
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn("h-7 px-2 rounded-sm", viewMode === "grid" && "bg-white shadow-sm")}
                      onClick={() => setViewMode("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-[#272727]">
                    {language === "PT" ? "Casos de Uso Salvos" : "Saved Use Cases"}
                  </h2>
                  <p className="text-sm text-[#A5A7B0]">
                    {filtered.length} {language === "PT" ? "casos de uso encontrados" : "use cases found"}
                  </p>
                </div>

                <div className={cn(
                  viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
                )}>
                  {filtered.map((s) => {
                    const uc = s.use_case;
                    if (!uc) return null;
                    const effort = effortMap[uc.effort || "high"] || effortMap.high;
                    const impact = impactMap[uc.impact || "high"] || impactMap.high;

                    return (
                      <div
                        key={s.id}
                        className="bg-white border border-[#A5A7B0]/20 rounded-sm p-5 hover:border-[#0C1BA8]/30 transition-all group"
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <Bookmark className="h-4 w-4 text-[#0C1BA8] fill-[#0C1BA8] shrink-0" />
                              <h3 className="font-semibold text-[#272727] text-sm">
                                {uc.title}
                              </h3>
                            </div>
                            <Badge className="text-[11px] font-normal mb-2 bg-[#A5A7B0]/10 border-[#A5A7B0]/20 text-[#272727] rounded-sm">
                              <Info className="h-3 w-3 mr-1" />
                              {uc.category}
                            </Badge>
                          </div>
                          <button
                            onClick={() => handleRemove(s.id)}
                            className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-red-50 text-[#A5A7B0] hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[#A5A7B0] mb-4">{uc.description}</p>

                        {/* Chain path */}
                        {s.l2_name && (
                          <p className="text-[11px] text-[#A5A7B0] mb-3">
                            {s.l2_name}{s.l3_name ? ` › ${s.l3_name}` : ""}{s.l4_name ? ` › ${s.l4_name}` : ""}
                          </p>
                        )}

                        {/* Effort & Impact bars */}
                        <div className="flex items-center gap-6 mb-3 text-xs">
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[#A5A7B0] flex items-center gap-1 shrink-0">
                              <Zap className="h-3 w-3" /> Effort
                            </span>
                            <div className="flex-1 h-2 bg-[#A5A7B0]/10 rounded-full overflow-hidden max-w-[120px]">
                              <div className={cn("h-full rounded-full", effort.color, effort.width)} />
                            </div>
                            <span className="text-[#272727] font-medium shrink-0">{effort.label}</span>
                          </div>
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-[#A5A7B0] flex items-center gap-1 shrink-0">
                              <TrendingUp className="h-3 w-3" /> Impacto
                            </span>
                            <div className="flex-1 h-2 bg-[#A5A7B0]/10 rounded-full overflow-hidden max-w-[120px]">
                              <div className={cn("h-full rounded-full", impact.color, impact.width)} />
                            </div>
                            <span className="text-[#272727] font-medium shrink-0">{impact.label}</span>
                          </div>
                        </div>

                        {/* Source & processes */}
                        <div className="flex items-center justify-between">
                          {uc.source_reference && (
                            <span className="text-xs text-[#0C1BA8] flex items-center gap-1 truncate max-w-[70%]">
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              {uc.source_reference}
                            </span>
                          )}
                          {(uc.impacted_processes_count || 0) > 0 && (
                            <span className="text-xs text-[#0C1BA8] font-medium ml-auto">
                              {uc.impacted_processes_count} {language === "PT" ? "processos impactados" : "impacted processes"}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && savedCases.length > 0 && (
                  <div className="text-center py-12 text-[#A5A7B0]">
                    {language === "PT" ? "Nenhum caso de uso encontrado com os filtros atuais" : "No use cases found with current filters"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
