import { useState, useEffect } from "react";
import { Search, Lightbulb, TrendingUp, Zap, Bookmark, BookmarkCheck, Trash2, ExternalLink, LayoutGrid, List, Info } from "lucide-react";
import { PrioritizationMatrix } from "./PrioritizationMatrix";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUseCaseStore, UseCase } from "@/stores/useCaseStore";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const categoryConfig: Record<string, { icon: any; label: string }> = {
  IA: { icon: Info, label: "IA" },
  Processo: { icon: LayoutGrid, label: "Processo" },
  Sistemas: { icon: Info, label: "Sistemas" },
};

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

export function UseCaseListStep() {
  const { language } = useLanguage();
  const { useCases, setSelectedUseCaseId, setStep, session } = useUseCaseStore();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const loadSaved = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || useCases.length === 0) return;
      const ucIds = useCases.map((uc) => uc.id);
      const { data } = await supabase
        .from("saved_use_cases")
        .select("use_case_id")
        .eq("user_id", user.id)
        .in("use_case_id", ucIds);
      if (data) {
        setSavedIds(new Set(data.map((d) => d.use_case_id)));
      }
    };
    loadSaved();
  }, [useCases]);

  const toggleSave = async (uc: UseCase, e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (savedIds.has(uc.id)) {
      await supabase.from("saved_use_cases").delete().eq("user_id", user.id).eq("use_case_id", uc.id);
      setSavedIds((prev) => { const s = new Set(prev); s.delete(uc.id); return s; });
      toast.success(language === "PT" ? "Removido dos salvos" : "Removed from saved");
    } else {
      const l1Id = searchParams.get("l1Id") || "";
      const sourceName = searchParams.get("sourceName") || "";
      const level = searchParams.get("level") || "";
      await supabase.from("saved_use_cases").insert({
        user_id: user.id,
        use_case_id: uc.id,
        l1_id: l1Id,
        l1_name: sourceName,
        l2_name: level === "l2" ? sourceName : (session?.source_names?.[0] || null),
        l3_name: level === "l3" ? sourceName : null,
        l4_name: level === "l4" ? sourceName : null,
      });
      setSavedIds((prev) => new Set(prev).add(uc.id));
      toast.success(language === "PT" ? "Caso de uso salvo!" : "Use case saved!");
    }
  };

  const filtered = useCases.filter((uc) => {
    const matchesSearch =
      !search ||
      uc.title.toLowerCase().includes(search.toLowerCase()) ||
      uc.description.toLowerCase().includes(search.toLowerCase());
    const dbCategory = filterCategory ? (categoryDbMap[filterCategory] || filterCategory) : null;
    const matchesCategory = !dbCategory || uc.category === dbCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelect = (uc: UseCase) => {
    setSelectedUseCaseId(uc.id);
    setStep(2);
  };

  const [showMatrix, setShowMatrix] = useState(false);

  const categories = language === "PT"
    ? ["IA", "Processo", "Sistemas"]
    : ["AI", "Process", "Systems"];

  // Map display labels back to DB values for filtering
  const categoryDbMap: Record<string, string> = language === "PT"
    ? { "IA": "IA", "Processo": "Processo", "Sistemas": "Sistemas" }
    : { "AI": "IA", "Process": "Processo", "Systems": "Sistemas" };

  return (
    <div className="flex gap-6">
      {/* Left sidebar */}
      <div className="w-[260px] shrink-0 space-y-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "PT" ? "Buscar..." : "Search..."}
            className="pl-9 bg-background"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
                  filterCategory === cat ? "bg-chain text-white border-chain" : "bg-background"
                )}
                onClick={() => setFilterCategory(filterCategory === cat ? null : cat)}
              >
                <Info className="h-3 w-3" />
                {cat}
              </Button>
            ))}
          </div>
        </div>

        <Button className="w-full gap-2 bg-chain hover:bg-chain-dark text-white" onClick={() => setShowMatrix(true)}>
          <LayoutGrid className="h-4 w-4" />
          {language === "PT" ? "Matriz de Priorização" : "Prioritization Matrix"}
        </Button>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {language === "PT" ? "Visualização" : "View"}
          </p>
          <div className="flex gap-1 bg-muted rounded-lg p-0.5">
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-7 px-2", viewMode === "list" && "bg-background shadow-sm")}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className={cn("h-7 px-2", viewMode === "grid" && "bg-background shadow-sm")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {language === "PT" ? "Ordenar por" : "Sort by"}
          </p>
          <Select defaultValue="default">
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="effort">{language === "PT" ? "Esforço" : "Effort"}</SelectItem>
              <SelectItem value="impact">{language === "PT" ? "Impacto" : "Impact"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-foreground">
            {language === "PT" ? "Casos de Uso" : "Use Cases"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {filtered.length} {language === "PT" ? "casos de uso encontrados" : "use cases found"}
          </p>
        </div>

        {(() => {
          const saved = filtered.filter((uc) => savedIds.has(uc.id));
          const others = filtered.filter((uc) => !savedIds.has(uc.id));

          const renderCard = (uc: UseCase) => {
            const effort = effortMap[uc.effort] || effortMap.high;
            const impact = impactMap[uc.impact] || impactMap.high;
            const isSaved = savedIds.has(uc.id);
            return (
              <div
                key={uc.id}
                className={cn(
                  "border rounded-sm p-5 transition-all group",
                  isSaved
                    ? "border-[#0C1BA8]/30 bg-[#0C1BA8]/[0.02] shadow-sm"
                    : "bg-card border-border hover:border-[#A5A7B0]/50"
                )}
              >
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div className="flex-1 cursor-pointer" onClick={() => handleSelect(uc)}>
                    <div className="flex items-center gap-2 mb-1.5">
                      <button onClick={(e) => toggleSave(uc, e)} className="shrink-0">
                        {isSaved ? (
                          <BookmarkCheck className="h-4 w-4 text-[#0C1BA8] fill-[#0C1BA8]" />
                        ) : (
                          <Bookmark className="h-4 w-4 text-muted-foreground hover:text-[#0C1BA8]" />
                        )}
                      </button>
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-chain-dark transition-colors">
                        {uc.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-[11px] font-normal mb-2 bg-muted/50 border-border">
                      <Info className="h-3 w-3 mr-1" />
                      {uc.category}
                    </Badge>
                  </div>
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive cursor-pointer shrink-0 mt-1" />
                </div>
                <p className="text-sm text-muted-foreground mb-4 cursor-pointer" onClick={() => handleSelect(uc)}>
                  {uc.description}
                </p>
                <div className="flex items-center gap-6 mb-3 text-xs">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                      <Zap className="h-3 w-3" /> Effort
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                      <div className={cn("h-full rounded-full", effort.color, effort.width)} />
                    </div>
                    <span className="text-foreground font-medium shrink-0">{effort.label}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-muted-foreground flex items-center gap-1 shrink-0">
                      <TrendingUp className="h-3 w-3" /> Impacto
                    </span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-[120px]">
                      <div className={cn("h-full rounded-full", impact.color, impact.width)} />
                    </div>
                    <span className="text-foreground font-medium shrink-0">{impact.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  {uc.source_reference && (
                    <a className="text-xs text-chain hover:underline flex items-center gap-1 truncate max-w-[70%]" href="#" onClick={(e) => e.stopPropagation()}>
                      <ExternalLink className="h-3 w-3 shrink-0" />
                      {uc.source_reference}
                    </a>
                  )}
                  {uc.impacted_processes_count > 0 && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="text-xs text-chain hover:text-chain-dark font-medium hover:underline cursor-pointer ml-auto" onClick={(e) => e.stopPropagation()}>
                          {uc.impacted_processes_count} {language === "PT" ? "processos impactados" : "impacted processes"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-64 p-3" align="end">
                        <p className="text-xs font-semibold text-foreground mb-2">
                          {language === "PT" ? "Processos Impactados" : "Impacted Processes"}
                        </p>
                        <ul className="space-y-1">
                          {(session?.process_names || []).slice(0, uc.impacted_processes_count).map((name, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <span className="h-1.5 w-1.5 rounded-full bg-chain shrink-0" />
                              {name}
                            </li>
                          ))}
                          {(!session?.process_names || session.process_names.length === 0) && (
                            <li className="text-xs text-muted-foreground italic">
                              {language === "PT" ? "Nomes não disponíveis" : "Names not available"}
                            </li>
                          )}
                        </ul>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            );
          };

          return (
            <>
              {saved.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <BookmarkCheck className="h-4 w-4 text-[#0C1BA8]" />
                    <h3 className="text-sm font-semibold text-[#272727]">
                      {language === "PT" ? "Salvos" : "Saved"} ({saved.length})
                    </h3>
                  </div>
                  <div className={cn(
                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
                  )}>
                    {saved.map((uc) => renderCard(uc))}
                  </div>
                </div>
              )}

              {others.length > 0 && (
                <div>
                  {saved.length > 0 && (
                    <div className="flex items-center gap-2 mb-3 pt-2 border-t border-[#A5A7B0]/20">
                      <h3 className="text-sm font-semibold text-[#A5A7B0]">
                        {language === "PT" ? "Outros" : "Others"} ({others.length})
                      </h3>
                    </div>
                  )}
                  <div className={cn(
                    viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"
                  )}>
                    {others.map((uc) => renderCard(uc))}
                  </div>
                </div>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  {language === "PT" ? "Nenhum caso de uso encontrado" : "No use cases found"}
                </div>
              )}
            </>
          );
        })()}
      </div>

      {showMatrix && (
        <PrioritizationMatrix
          useCases={useCases}
          savedIds={savedIds}
          onClose={() => setShowMatrix(false)}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
}
